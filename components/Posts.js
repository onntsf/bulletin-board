import styles from './styles/Posts.module.css';

const Posts = ({ posts }) => posts.map((post) => (
  <div className={styles.post} data-id={post.id} data-userid={post.user_id}>
    <div className="meta">
      <span className="number">{post.id}</span>
      <span className="name">{post.user_name}</span>
      <span className="date">{post.updated_date}</span>
      <span className="uid">{post.user_id}</span>
    </div>
    <div className="message">
      <span className="escaped">{post.body_text}</span>
    </div>
  </div>
));

export default Posts;
