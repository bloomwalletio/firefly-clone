<script lang="typescript">
    import { Icon } from '@auxiliary/icon'
    import { openPopup, PopupId } from '../../../desktop/lib/auxiliary/popup'
    import { localize } from '@core/i18n'
    import { Modal, MenuItem } from 'shared/components'

    export let modal: Modal = undefined

    function onRevoteClick(): void {
        openPopup({
            id: PopupId.Revote,
        })
        modal.close()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        <MenuItem
            icon={Icon.Delete}
            iconProps={{ width: '16', height: '19' }}
            title={localize('actions.revote')}
            onClick={onRevoteClick}
        />
    </div>
</Modal>
