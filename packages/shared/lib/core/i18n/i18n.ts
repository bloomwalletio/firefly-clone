/*
 * Code following https://phrase.com/blog/posts/a-step-by-step-guide-to-svelte-localization-with-svelte-i18n-v3/
 */

import { get } from 'svelte/store'
import { addMessages, dictionary, getLocaleFromNavigator, init, _, getDateFormatter } from 'svelte-i18n'

import { appSettings } from 'shared/lib/appSettings'

import { LOCALE_OPTIONS, LANGUAGES } from '@core/i18n/constants'
import { LanguageChoice, LocaleDateOptions, LocaleOptions } from '@core/i18n/types'

const MESSAGE_FILE_URL_TEMPLATE = 'locales/{locale}.json'

/**
 * Initializes the internationalization capabilities for Firefly, loading the appropriate locale
 * dictionary and preparing it for use.
 *
 * @param {LocaleOptions} options
 *
 * @returns {Promise<unknown>}
 */
export const setupI18n = (options: LocaleOptions = { fallbackLocale: 'en', initialLocale: null }): Promise<unknown> => {
    // If we're given an explicit locale, we use
    // it. Otherwise, we attempt to auto-detect
    // the user's locale.
    const _locale = supported(options.initialLocale || reduceLocale(getLocaleFromNavigator() || 'en'))

    init({ ...LOCALE_OPTIONS, initialLocale: _locale } as LocaleOptions)

    // Don't re-download translation files
    if (!hasLocaleEntry(_locale)) {
        const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', _locale)
        // Download translation file for given locale/language
        return loadJson(messagesFileUrl).then((messages) => {
            addMessages(_locale, messages)
            appSettings.set({
                ...get(appSettings),
                language: _locale,
            })

            // If we have not loaded "en" make sure we have it as a backup language
            // in case the chosen language does not have all the translations
            if (_locale !== 'en' && !hasLocaleEntry('en')) {
                const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', 'en')
                void loadJson(messagesFileUrl).then((messages) => {
                    addMessages('en', messages)
                })
            }
        })
    }
}

/**
 * Determines whether a locale has a corresponding dictionary entry.
 */
const hasLocaleEntry = (locale: string) => get(dictionary)[locale]

/**
 * Extract "en" from the list of supported languages.
 */
function reduceLocale(locale) {
    return locale.replace('_', '-').split('-')[0]
}

/**
 * Check to see if the given locale is supported
 * by Firefly (if not then return the fallback locale
 * from the default locale options).
 */
function supported(locale) {
    if (Object.keys(LANGUAGES).includes(locale)) {
        return locale
    } else {
        return LOCALE_OPTIONS.fallbackLocale
    }
}

/**
 * Loads an arbitrary json file at a given path.
 */
function loadJson(url) {
    return fetch(url).then((response) => response.json())
}

/**
 * Sets a language for Firefly, overwriting any currently set language.
 *
 * @param {LanguageChoice} language
 *
 * @returns {void}
 */
export const setLanguage = (language: LanguageChoice): void => {
    const locale = Object.keys(LANGUAGES).find((key) => LANGUAGES[key] === language.value)
    appSettings.set({
        ...get(appSettings),
        language: locale,
    })

    void setupI18n({ fallbackLocale: 'en', initialLocale: locale })
}

/**
 * Wraps the internationalization dictionary, allowing for usage
 * in either Svelte components or other TypeScript library files.
 */
export const localize = get(_) as (string, values?) => string

/**
 * Formats a date according to the current locale and provided date options.
 *
 * @param {Date} date
 * @param {LocaleDateOptions} options
 *
 * @returns {string} The formatted date as a string.
 */
export const formatDate = (date: Date, options: LocaleDateOptions): string =>
    getDateFormatter({ locale: getLocaleFromNavigator(), ...options }).format(date)

/**
 * Expose a single API svelte-i1un store for internationalization.
 */
export { _ }
