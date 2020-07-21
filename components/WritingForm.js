import styles from "./styles/WritingForm.module.css";

// 投稿書き込みフォーム
class WritingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val_name: this.props.update_data.user_name,
      val_email: this.props.update_data.user_email,
      val_body: this.props.update_data.body_text
    };
  }

  // 名前変更時に値を維持
  handleNameChange(e) {
    e.preventDefault();
    this.setState({ val_name: e.target.value });
  }

  // メールアドレス変更時に値を維持
  handleEmailChange(e) {
    e.preventDefault();
    this.setState({ val_email: e.target.value });
  }

  // 本文変更時に値を維持
  handleBodyChange(e) {
    e.preventDefault();
    this.setState({ val_body: e.target.value });
  }

  render() {
    return (
      <div className={styles.formbox}>
        <div className={styles.formheader}>{this.props.title}</div>
        <form
          method="post"
          onSubmit={e =>
            this.props.onSubmit(e, this.state, this.props.update_data)
          }
          className={styles.formbody}
        >
          <input
            type="text"
            placeholder="名前(省略可)"
            value={this.state.val_name}
            onChange={e => this.handleNameChange(e)}
            className={styles.formelem}
          />
          <input
            type="text"
            placeholder="メールアドレス(省略可)"
            value={this.state.val_email}
            onChange={e => this.handleEmailChange(e)}
            className={styles.formelem}
          />
          <textarea
            placeholder="コメント内容"
            rows="5"
            cols="70"
            wrap="off"
            value={this.state.val_body}
            onChange={e => this.handleBodyChange(e)}
            className={styles.formelem}
          />
          <input type="submit" value="書き込む" className={styles.submit} />
        </form>
      </div>
    );
  }
}

export default WritingForm;
