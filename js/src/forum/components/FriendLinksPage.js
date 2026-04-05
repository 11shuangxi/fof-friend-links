import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';

export default class FriendLinksPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);
    app.history.push('friendLinks', app.translator.trans('fof-friend-links.forum.page_title'));

    this.links = [];
    this.loading = true;
    this.hasMore = false;

    this.loadResults();
  }

  loadResults(offset = 0) {
    this.loading = true;
    app.store.find('friend-links', { page: { offset } })
      .then(links => {
        this.links.push(...links);
        this.hasMore = !!links.payload.links?.next;
        this.loading = false;
        m.redraw();
      });
  }

  loadMore() {
    this.loadResults(this.links.length);
  }

  view() {
    const title = app.forum.attribute('fofFriendLinksPageTitle') || app.translator.trans('fof-friend-links.forum.page_title');
    const desc = app.forum.attribute('fofFriendLinksPageDesc') || app.translator.trans('fof-friend-links.forum.page_desc');

    return (
      <div className="FriendLinksPage">
        <div className="container">
          <div className="FriendLinksPage-header">
            <h2>{title}</h2>
            <p>{desc}</p>
          </div>
          
          {this.links.length === 0 && this.loading ? (
            <p className="FriendLinksPage-loading">Loading...</p>
          ) : (
            <div>
              <div className="FriendLinksGrid">
                {this.links.map(link => (
                  <div className="FriendLinkCard">
                    <a href={link.site_url()} target="_blank" rel="noopener noreferrer" className="FriendLinkCard-content">
                      <div className="FriendLinkCard-logo">
                        <img src={link.logo_url()} alt={link.site_name()} loading="lazy" />
                      </div>
                      <div className="FriendLinkCard-title">{link.site_name()}</div>
                    </a>
                  </div>
                ))}
              </div>
              
              {this.hasMore && (
                <div className="FriendLinksPage-loadMore" style={{ textAlign: 'center', marginTop: '20px' }}>
                  {Button.component({
                    className: 'Button Button--primary',
                    loading: this.loading,
                    onclick: this.loadMore.bind(this)
                  }, app.translator.trans('core.forum.discussion_list.load_more_button'))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
