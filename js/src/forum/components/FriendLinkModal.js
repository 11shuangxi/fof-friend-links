import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';

import Stream from 'flarum/common/utils/Stream';

export default class FriendLinkModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.siteName = Stream('');
    this.siteUrl = Stream('');
    this.logoUrl = Stream('');
    this.loading = false;
  }

  title() {
    return app.translator.trans('fof-friend-links.forum.modal.title');
  }

  content() {
    const mySiteName = app.forum.attribute('fofFriendLinksSiteName');
    const mySiteUrl = app.forum.attribute('fofFriendLinksSiteUrl');
    const mySiteLogo = app.forum.attribute('fofFriendLinksSiteLogo');

    return (
      <div className="Modal-body">
        {(mySiteName || mySiteUrl || mySiteLogo) ? (
          <div className="FriendLinks-MySiteInfo" style="background: rgba(142, 182, 230, 0.12); padding: 16px 20px; border-radius: 8px; margin-bottom: 25px; color: var(--text-color);">
            <div style="margin-bottom: 12px; color: var(--heading-color); font-size: 14px;">
              {app.translator.trans('fof-friend-links.forum.modal.my_site_info_title', { default: '本站信息' })}
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
              {mySiteName ? 
                <div style="display: flex;">
                  <strong style="width: 55px; flex-shrink: 0; color: var(--heading-color);">{app.translator.trans('fof-friend-links.forum.modal.my_site_name', { default: '名称' })}：</strong> 
                  <span style="word-break: break-all; color: var(--text-color);">{mySiteName}</span>
                </div> 
              : null}
              {mySiteUrl ? 
                <div style="display: flex;">
                  <strong style="width: 55px; flex-shrink: 0; color: var(--heading-color);">{app.translator.trans('fof-friend-links.forum.modal.my_site_url', { default: '地址' })}：</strong> 
                  <span style="word-break: break-all; color: var(--text-color);">{mySiteUrl}</span>
                </div> 
              : null}
              {mySiteLogo ? 
                <div style="display: flex;">
                  <strong style="width: 55px; flex-shrink: 0; color: var(--heading-color);">{app.translator.trans('fof-friend-links.forum.modal.my_site_logo', { default: 'LOGO' })}：</strong> 
                  <span style="word-break: break-all; color: var(--text-color);">{mySiteLogo}</span>
                </div> 
              : null}
            </div>
          </div>
        ) : null}
        
        <div className="Form-group">
          <label>{app.translator.trans('fof-friend-links.forum.modal.site_name')}</label>
          <input className="FormControl" type="text" placeholder={app.translator.trans('fof-friend-links.forum.modal.site_name_placeholder')} value={this.siteName()} oninput={e => this.siteName(e.target.value)} maxlength="30" />
        </div>
        
        <div className="Form-group">
          <label>{app.translator.trans('fof-friend-links.forum.modal.site_url')}</label>
          <input className="FormControl" type="text" placeholder={app.translator.trans('fof-friend-links.forum.modal.site_url_placeholder')} value={this.siteUrl()} oninput={e => this.siteUrl(e.target.value)} />
        </div>
        
        <div className="Form-group">
          <label>{app.translator.trans('fof-friend-links.forum.modal.logo_url')}</label>
          <input className="FormControl" type="text" placeholder={app.translator.trans('fof-friend-links.forum.modal.logo_url_placeholder')} value={this.logoUrl()} oninput={e => this.logoUrl(e.target.value)} />
          <div className="helpText">{app.translator.trans('fof-friend-links.forum.modal.logo_help')}</div>
        </div>

        <div className="Form-group">
          {Button.component({
            className: 'Button Button--primary Button--block',
            type: 'submit',
            loading: this.loading,
            disabled: !this.siteName() || !this.siteUrl() || !this.logoUrl()
          }, app.translator.trans('fof-friend-links.forum.modal.submit'))}
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

    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/friend-links',
      body: {
        data: {
          type: 'friend-links',
          attributes: {
            site_name: this.siteName(),
            site_url: this.siteUrl(),
            logo_url: this.logoUrl()
          }
        }
      }
    }).then(() => {
      app.alerts.show({ type: 'success' }, app.translator.trans('fof-friend-links.forum.modal.success'));
      this.hide();
    }).catch(err => {
      this.loading = false;
      m.redraw();
      throw err;
    });
  }
}
