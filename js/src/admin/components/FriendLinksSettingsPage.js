import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import FriendLink from '../../common/models/FriendLink';
import Button from 'flarum/common/components/Button';
import AddFriendLinkModal from './AddFriendLinkModal';
import RejectFriendLinkModal from './RejectFriendLinkModal';

export default class FriendLinksSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
    
    this.links = [];
    this.loading = true;
    this.activeTab = 'settings'; // default tab: settings, mail, list
    this.loadLinks();
  }

  loadLinks() {
    this.loading = true;
    app.store.find('friend-links')
      .then(links => {
        this.links = links;
        this.loading = false;
        m.redraw();
      })
      .catch(e => {
        this.loading = false;
        m.redraw();
        throw e;
      });
  }

  updateStatus(link, status, reason = '') {
    link.save({ status, reject_reason: reason })
      .then(() => {
        m.redraw();
        const alertId = app.alerts.show({ type: 'success' }, app.translator.trans('fof-friend-links.admin.modal.success'));
        setTimeout(() => app.alerts.dismiss(alertId), 3000);
      });
  }

  deleteLink(link) {
    if (confirm(app.translator.trans('fof-friend-links.admin.list.confirm_delete'))) {
      link.delete().then(() => {
        this.loadLinks();
      });
    }
  }

  content() {
    return [
      m('.ExtensionPage-FriendLinks', [
        m('.container', [
          m('.FriendLinks-Tabs', [
            m('ul.nav.nav-tabs', [
              m('li.nav-item', { className: this.activeTab === 'settings' ? 'active' : '' }, [
                m('a.nav-link', {
                  onclick: () => this.activeTab = 'settings'
                }, app.translator.trans('fof-friend-links.admin.settings.title'))
              ]),
              m('li.nav-item', { className: this.activeTab === 'mail' ? 'active' : '' }, [
                m('a.nav-link', {
                  onclick: () => this.activeTab = 'mail'
                }, app.translator.trans('fof-friend-links.admin.settings.mail_title'))
              ]),
              m('li.nav-item', { className: this.activeTab === 'list' ? 'active' : '' }, [
                m('a.nav-link', {
                  onclick: () => this.activeTab = 'list'
                }, app.translator.trans('fof-friend-links.admin.list.title'))
              ])
            ])
          ]),

          m('.FriendLinks-TabContent', [
            // Settings Tab
            this.activeTab === 'settings' ? m('.FriendLinks-Settings', [
              this.buildSettingComponent({
                type: 'text',
                setting: 'fof-friend-links.site_name',
                label: app.translator.trans('fof-friend-links.admin.settings.site_name'),
              }),
              this.buildSettingComponent({
                type: 'text',
                setting: 'fof-friend-links.site_url',
                label: app.translator.trans('fof-friend-links.admin.settings.site_url'),
              }),
              this.buildSettingComponent({
                type: 'text',
                setting: 'fof-friend-links.site_logo',
                label: app.translator.trans('fof-friend-links.admin.settings.site_logo'),
              }),
              this.buildSettingComponent({
                type: 'number',
                setting: 'fof-friend-links.max_items',
                label: app.translator.trans('fof-friend-links.admin.settings.max_items'),
                default: 10
              }),
              this.submitButton()
            ]) : null,

            // Mail Tab
            this.activeTab === 'mail' ? m('.FriendLinks-MailSettings', [
              this.buildSettingComponent({
                type: 'boolean',
                setting: 'fof-friend-links.enable_mail_notifications',
                label: app.translator.trans('fof-friend-links.admin.settings.enable_mail_notifications'),
              }),
              this.setting('fof-friend-links.enable_mail_notifications')() === true || this.setting('fof-friend-links.enable_mail_notifications')() === '1' ? [
                this.buildSettingComponent({
                  type: 'textarea',
                  rows: 3,
                  setting: 'fof-friend-links.mail_new',
                  label: app.translator.trans('fof-friend-links.admin.settings.mail_new'),
                  help: app.translator.trans('fof-friend-links.admin.settings.mail_new_help'),
                  placeholder: "新友情链接申请:\n申请人邮箱: {$userEmail}\n网站名称: {$siteName}\n网站地址: {$siteUrl}"
                }),
                this.buildSettingComponent({
                  type: 'textarea',
                  rows: 3,
                  setting: 'fof-friend-links.mail_approved',
                  label: app.translator.trans('fof-friend-links.admin.settings.mail_approved'),
                  help: app.translator.trans('fof-friend-links.admin.settings.mail_approved_help'),
                  placeholder: "用户名称：{$username}\n您申请的网站名称：{$siteName}\n您申请提交的链接：{$siteUrl}\n已通过审核。"
                }),
                this.buildSettingComponent({
                  type: 'textarea',
                  rows: 3,
                  setting: 'fof-friend-links.mail_rejected',
                  label: app.translator.trans('fof-friend-links.admin.settings.mail_rejected'),
                  help: app.translator.trans('fof-friend-links.admin.settings.mail_rejected_help'),
                  placeholder: "用户名称：{$username}\n您申请的网站名称：{$siteName}\n您申请提交的链接：{$siteUrl}\n未通过审核，拒绝理由：{$reason}"
                })
              ] : null,
              this.submitButton()
            ]) : null,
            
            // List Tab
            this.activeTab === 'list' ? m('.FriendLinks-Applications', [
              m('.FriendLinks-Applications-Header', { style: 'display: flex; justify-content: flex-end; align-items: center; border-bottom: 2px solid var(--control-bg, #e8ecf3); margin-bottom: 20px; padding-bottom: 10px;' }, [
                Button.component({
                  className: 'Button Button--primary',
                  icon: 'fas fa-plus',
                  onclick: () => app.modal.show(AddFriendLinkModal, { onAdd: () => this.loadLinks() })
                }, app.translator.trans('fof-friend-links.admin.list.add'))
              ]),
              this.loading ? m('p', 'Loading...') : m('table.FriendLinks-Table', [
                m('thead', [
                  m('tr', [
                    m('th', app.translator.trans('fof-friend-links.admin.list.user')),
                    m('th', app.translator.trans('fof-friend-links.admin.list.site_name')),
                    m('th', app.translator.trans('fof-friend-links.admin.list.url')),
                    m('th', app.translator.trans('fof-friend-links.admin.list.logo')),
                    m('th', app.translator.trans('fof-friend-links.admin.list.status')),
                    m('th', app.translator.trans('fof-friend-links.admin.list.action'))
                  ])
                ]),
                m('tbody', this.links.map(link => {
                  const user = link.user();
                  return m('tr', [
                    m('td.User-cell', [
                      m('.username', user ? user.username() : 'Unknown'),
                      m('.email', user ? user.email() : '')
                    ]),
                    m('td', link.site_name()),
                    m('td', m('a', { href: link.site_url(), target: '_blank' }, link.site_url())),
                    m('td.Logo-cell', m('a', { href: link.logo_url(), target: '_blank' }, [
                      m('img', { src: link.logo_url() })
                    ])),
                    m('td', [
                      m(`span.Status-badge.${link.status()}`, app.translator.trans(`fof-friend-links.admin.list.statuses.${link.status()}`))
                    ]),
                    m('td.Action-buttons', [
                      Button.component({
                        className: 'Button Button--icon',
                        icon: 'fas fa-edit',
                        onclick: () => app.modal.show(AddFriendLinkModal, { link, onAdd: () => this.loadLinks() })
                      }, app.translator.trans('fof-friend-links.admin.list.edit')),
                      link.status() !== 'approved' ? Button.component({
                        className: 'Button Button--primary',
                        onclick: () => {
                          if (confirm(app.translator.trans('fof-friend-links.admin.list.confirm_approve'))) {
                            this.updateStatus(link, 'approved');
                          }
                        }
                      }, app.translator.trans('fof-friend-links.admin.list.approve')) : '',
                      link.status() === 'approved' ? Button.component({
                        className: 'Button Button--danger',
                        icon: 'fas fa-trash',
                        onclick: () => this.deleteLink(link)
                      }, app.translator.trans('fof-friend-links.admin.list.delete')) : 
                      (link.status() !== 'rejected' ? Button.component({
                        className: 'Button Button--danger',
                        onclick: () => {
                          app.modal.show(RejectFriendLinkModal, { link, onReject: () => this.loadLinks() });
                        }
                      }, app.translator.trans('fof-friend-links.admin.list.reject')) : '')
                    ])
                  ]);
                }))
              ])
            ]) : null
          ])
        ])
      ])
    ];
  }
}
