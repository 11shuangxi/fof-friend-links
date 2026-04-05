import app from 'flarum/admin/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';

export default class RejectFriendLinkModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    
    this.link = this.attrs.link;
    this.customReason = Stream('');
    this.loading = false;
  }

  title() {
    return app.translator.trans('fof-friend-links.admin.list.reject_modal.title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form-group">
          <label>{app.translator.trans('fof-friend-links.admin.list.reject_modal.reason_label')}</label>
          <textarea 
            className="FormControl" 
            rows="3"
            placeholder={app.translator.trans('fof-friend-links.admin.list.reject_modal.custom_reason')} 
            value={this.customReason()} 
            oninput={e => this.customReason(e.target.value)} 
            required
          />
        </div>

        <div className="Form-group">
          {Button.component({
            className: 'Button Button--danger Button--block RejectSubmitButton',
            type: 'submit',
            loading: this.loading,
            disabled: !this.customReason().trim()
          }, app.translator.trans('fof-friend-links.admin.list.reject_modal.submit'))}
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();
    this.loading = true;

    const finalReason = this.customReason().trim();

    this.link.save({ status: 'rejected', reject_reason: finalReason })
      .then(() => {
        // Now that the link is rejected (and thus deleted on the backend), we remove it from the frontend store
        app.store.remove(this.link);
        const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-friend-links.admin.modal.success'));
        setTimeout(() => app.alerts.dismiss(alertId), 3000);
        this.hide();
        if (this.attrs.onReject) this.attrs.onReject();
      })
      .catch(err => {
        this.loading = false;
        m.redraw();
        throw err;
      });
  }
}