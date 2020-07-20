import styles from "./styles/Posts.module.css";
import Link from "next/link";

class Posts extends React.Component {
  createBodyText(data) {
    const regex_anchor = />>(\d+)/gi;
    const regex_number = /(\d+)/i;

    return data.split(regex_anchor).map(line => {
      if (line.match(regex_number)) {
        return (
          <Link href="/posts/[id]" as={`/posts/${line}`}>
            <a target="_blank" className={styles.refer_to}>
              >>{line}
            </a>
          </Link>
        );
      } else {
        return line;
      }
    });
  }

  createReferredAnchor(references, ref_index, id) {
    const anchor = [];
    let i = ref_index;
    while (i < references.length) {
      const reference = references[ref_index];
      if (reference.refer_to === id) {
        const referred_from = reference.referred_from;
        const obj = (
          <Link href="/posts/[id]" as={`/posts/${referred_from}`}>
            <a target="_blank" className={styles.referred_from}>
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

  render() {
    let ref_index = 0;
    return this.props.posts.map(post => {
      const id = post.id;
      const result = this.createReferredAnchor(
        this.props.reference,
        ref_index,
        id
      );
      ref_index = result.ref;

      return (
        <div className={styles.post} data-id={id} data-userid={post.user_id}>
          <div className="meta">
            <span className="number">{id}</span>
            <span className="name">{post.user_name}</span>
            <span className="date">{post.updated_date}</span>
            <span className="uid">{post.user_id}</span>
            <span className="referred">{result.anchor}</span>
          </div>
          <div className="message">
            <span className="escaped">
              {this.createBodyText(post.body_text)}
            </span>
          </div>
          <div className={styles.operation}>
            <Link href="/update/[id]" as={`/update/${id}`}>
              <a>更新</a>
            </Link>
            <Link href="/confirm/[id]?deleteid=1" as={`/confirm/${id}?deleteid=1`}>
              <a>削除</a>
            </Link>
          </div>
        </div>
      );
    });
  }
}

export default Posts;
