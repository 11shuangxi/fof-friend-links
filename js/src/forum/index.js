import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import FriendLink from '../common/models/FriendLink';
import FriendLinksPage from './components/FriendLinksPage';
import FriendLinkModal from './components/FriendLinkModal';
import Footer from 'flarum/forum/components/Footer'; // Note: Flarum doesn't have a default Footer component, usually it's injected in app or via indexPage
import IndexPage from 'flarum/forum/components/IndexPage';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';

app.initializers.add('fof-friend-links', () => {
  app.store.models['friend-links'] = FriendLink;

  app.routes.friendLinks = { path: '/friend-links', component: FriendLinksPage };

  extend(IndexPage.prototype, 'view', function (vdom) {
    if (!vdom || !vdom.children) return;

    // Load links if not loaded
    if (!this.friendLinksLoaded && !this.friendLinksLoading) {
      this.friendLinksLoading = true;
      app.store.find('friend-links')
        .then(links => {
          this.friendLinksLoaded = true;
          this.friendLinks = links;
          m.redraw();
        });
    }

    const maxItems = app.forum.attribute('fofFriendLinksMaxItems') || 10;
    const links = this.friendLinks || [];
    const displayedLinks = links.slice(0, maxItems);
    const hasMore = links.length > maxItems;

    const footer = (
      <div className="FriendLinksFooter">
        <div className="container">
          <div className="FriendLinksFooter-inner">
            <div className="FriendLinksFooter-header">
              <h3><i className="fas fa-link" style="margin-right: 6px;"></i>友情链接</h3>
              {app.session.user ? (
                <Button className="Button Button--link FriendLinksFooter-applyBtn" onclick={() => app.modal.show(FriendLinkModal)}>
                  申请链接
                </Button>
              ) : null}
            </div>
            <ul className="FriendLinksFooter-list">
              {displayedLinks.map(link => (
                <li>
                  <a href={link.site_url()} target="_blank" rel="noopener noreferrer">{link.site_name()}</a>
                </li>
              ))}
              {hasMore ? (
                <li className="FriendLinksFooter-more-item">
                  <Link href={app.route('friendLinks')} className="FriendLinksFooter-more">更多链接 &raquo;</Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    );

    // Append to index page
    vdom.children.push(footer);
  });
});
