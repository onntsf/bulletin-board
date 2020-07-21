import Link from "next/link";
import formatter from "../util/Formatter.js";
import styles from "./styles/Posts.module.css";

// 既存投稿を全て表示する。
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouse_over: false,
      post_data: {},
      mouse_x: 0,
      mouse_y: 0
    };

    this.posts = this.createPosts(this.props.posts);
  }

  // 投稿本文中の参照箇所にリンクを貼る
  createBodyText(data) {
    const regex_anchor = /(>>\d+|https?.+\s)/gi;
    const regex_number = />>(\d+)/gi;
    const regex_link = /(https?:\/\/.+)\s/gi;

    return data.split(regex_anchor).map(line => {
      const matched_array = [...line.matchAll(regex_number)];

      if (matched_array.length > 0) {
        const post_id = matched_array[0][1];
        return (
          <Link href="/posts/[id]" as={`/posts/${post_id}`}>
            <a
              target="_blank"
              className={styles.refer_to}
              onMouseEnter={e => this.showAnchorPost(e, post_id)}
              onMouseLeave={e => this.hideAnchorPost(e, post_id)}
            >
              >>{post_id}
            </a>
          </Link>
        );
      } else if (line.match(regex_link)) {
        return (
          <a href={line} target="_blank" className="classsss">
            {line}
          </a>
        );
      } else {
        return line;
      }
    });
  }

  // 対象投稿に参照されている投稿のリンクを作る
  createReferredAnchor(references, ref_index, id) {
    const anchor = [];
    let i = ref_index;
    while (i < references.length) {
      const reference = references[ref_index];
      if (reference.refer_to === id) {
        const referred_from = reference.referred_from;
        const obj = (
          <Link href="/posts/[id]" as={`/posts/${referred_from}`}>
            <a
              target="_blank"
              className={styles.referred_from}
              onMouseEnter={e => this.showAnchorPost(e, referred_from)}
              onMouseLeave={e => this.hideAnchorPost(e, referred_from)}
            >
              >>{referred_from}
            </a>
          </Link>
        );

        anchor.push(obj);
        ref_index++;
      } else {
        break;
      }
      i++;
    }
    return { ref: ref_index, anchor: anchor };
  }

  // アンカーにマウスオーバーした時の処理。対象投稿をマウス付近に表示する。
  showAnchorPost(e, id) {
    const post_data = this.posts.find(post => post.key == id);
    this.setState({
      post_data: post_data,
      mouse_over: true,
      mouse_x: e.pageX,
      mouse_y: e.pageY
    });
  }

  // アンカーからマウスアウトした時の処理。対象投稿表示をやめる。
  hideAnchorPost(e, id) {
    this.setState({ post_data: {}, mouse_over: false });
  }

  // 既存投稿の表示作成
  createPosts(posts) {
    let ref_index = 0;

    return posts.map(post => {
      const id = post.id;
      const date = formatter.dateSlice(post.updated_date);
      const email = post.user_email;

      let name;
      if (email) {
        name = (
          <a className={styles.email} href={`mailto:${email}`}>
            {post.user_name}
          </a>
        );
      } else {
        name = post.user_name;
      }

      const result = this.createReferredAnchor(
        this.props.reference,
        ref_index,
        id
      );
      ref_index = result.ref;

      return (
        <div className={styles.post} key={id} data-userid={post.user_id}>
          <div className={styles.meta}>
            <span className={styles.number}>{id}</span>
            <span className={styles.name}>{name}</span>
            <span className={styles.date}>{date}</span>
            <span className={styles.uid}>ID:{post.user_id}</span>
            <span className={styles.referred}>{result.anchor}</span>
          </div>
          <div className={styles.message}>
            <span className={styles.escaped}>
              {this.createBodyText(post.body_text)}
            </span>
          </div>
          <div className={styles.operation}>
            <Link href="/update/[id]" as={`/update/${id}`}>
              <a>更新</a>
            </Link>
            <Link
              href="/confirm/[id]?deleteid=1"
              as={`/confirm/${id}?deleteid=1`}
            >
              <a>削除</a>
            </Link>
          </div>
        </div>
      );
    });
  }

  // 全ての既存投稿を囲む(スタイルの都合上)
  wrapPosts(posts) {
    return posts.map(post => <div className={styles.post_wrap}>{post}</div>);
  }

  render() {
    // アンカーマウスオーバ時
    if (this.state.mouse_over) {
      const anchor_data = (
        <div
          className={styles.anchor_data}
          style={{
            position: "absolute",
            left: this.state.mouse_x,
            top: this.state.mouse_y
          }}
        >
          {this.state.post_data}
        </div>
      );
      return [this.wrapPosts(this.posts), anchor_data];
    } else {
      // アンカーマウスオーバ以外
      return this.wrapPosts(this.posts);
    }
  }
}

export default Posts;
