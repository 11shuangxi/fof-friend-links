import app from 'flarum/admin/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';

export default class AddFriendLinkModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.isEditing = !!this.attrs.link;
    this.link = this.attrs.link;

    this.siteName = Stream(this.isEditing ? this.link.site_name() : '');
    this.siteUrl = Stream(this.isEditing ? this.link.site_url() : '');
    this.logoUrl = Stream(this.isEditing ? this.link.logo_url() : '');
    this.status = Stream(this.isEditing ? this.link.status() : 'pending');
    this.loading = false;
  }

  title() {
    return this.isEditing ? app.translator.trans('fof-friend-links.admin.modal.edit_title') : app.translator.trans('fof-friend-links.admin.modal.title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form-group">
          <label>{app.translator.trans('fof-friend-links.admin.modal.site_name')}</label>
          <input className="FormControl" type="text" value={this.siteName()} oninput={e => this.siteName(e.target.value)} maxlength="30" />
        </div>
        
        <div className="Form-group">
          <label>{app.translator.trans('fof-friend-links.admin.modal.site_url')}</label>
          <input className="FormControl" type="text" value={this.siteUrl()} oninput={e => this.siteUrl(e.target.value)} />
        </div>
        
        <div className="Form-group">
          <label>{app.translator.trans('fof-friend-links.admin.modal.logo_url')}</label>
          <input className="FormControl" type="text" value={this.logoUrl()} oninput={e => this.logoUrl(e.target.value)} />
        </div>

        <div className="Form-group">
          <label>{app.translator.trans('fof-friend-links.admin.modal.status')}</label>
          <select className="FormControl" value={this.status()} onchange={e => this.status(e.target.value)}>
            <option value="pending">{app.translator.trans('fof-friend-links.admin.list.statuses.pending')}</option>
            <option value="approved">{app.translator.trans('fof-friend-links.admin.list.statuses.approved')}</option>
            <option value="rejected">{app.translator.trans('fof-friend-links.admin.list.statuses.rejected')}</option>
          </select>
        </div>

        <div className="Form-group">
          {Button.component({
            className: 'Button Button--primary Button--block',
            type: 'submit',
            loading: this.loading,
            disabled: !this.siteName() || !this.siteUrl() || !this.logoUrl()
          }, this.isEditing ? app.translator.trans('fof-friend-links.admin.settings.save') : app.translator.trans('fof-friend-links.admin.modal.submit'))}
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    if (!/^https?:\/\//i.test(this.siteUrl())) {
      app.alerts.show({ type: 'error' }, app.translator.trans('fof-friend-links.forum.modal.error_url'));
      return;
    }

    if (!/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg)$/i.test(this.logoUrl())) {
      app.alerts.show({ type: 'error' }, app.translator.trans('fof-friend-links.forum.modal.error_logo'));
      return;
    }

    this.loading = true;

    if (this.isEditing) {
      this.link.save({
        site_name: this.siteName(),
        site_url: this.siteUrl(),
        logo_url: this.logoUrl(),
        status: this.status()
      }).then(() => {
        const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-friend-links.admin.modal.success'));
        setTimeout(() => app.alerts.dismiss(alertId), 3000);
        this.hide();
        if (this.attrs.onAdd) this.attrs.onAdd();
      }).catch(err => {
        this.loading = false;
        m.redraw();
        throw err;
      });
    } else {
      app.store.createRecord('friend-links').save({
        site_name: this.siteName(),
        site_url: this.siteUrl(),
        logo_url: this.logoUrl(),
        status: this.status()
      }).then(() => {
        const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-friend-links.admin.modal.success'));
        setTimeout(() => app.alerts.dismiss(alertId), 3000);
        this.hide();
        if (this.attrs.onAdd) this.attrs.onAdd();
      }).catch(err => {
        this.loading = false;
        m.redraw();
        throw err;
      });
    }
  }
}
