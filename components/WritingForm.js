import styles from "./styles/Posts.module.css"

class WritingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val_name: props.init.name,
      val_email: props.init.email,
      val_body: props.init.bodytext,
    };
  }

  handleNameChange(e) {
    e.preventDefault();
    this.setState({ val_name: e.target.value });
  }

  handleEmailChange(e) {
    e.preventDefault();
    this.setState({ val_email: e.target.value });
  }

  handleBodyChange(e) {
    e.preventDefault();
    this.setState({ val_body: e.target.value });
  }

  render() {
    return (
      <form
        method="post"
        onSubmit={e => this.props.onSubmit(e, this.state, this.props.update_data)}
        className={styles.form}
      >
        名前：
        <input
          type="text"
          value={this.state.val_name}
          onChange={e => this.handleNameChange(e)}
          className={styles.name}
        />
        E-mail：
        <input
          type="text"
          value={this.state.val_email}
          onChange={e => this.handleEmailChange(e)}
          className={styles.email}
        />
        <textarea
          value={this.state.val_body}
          onChange={e => this.handleBodyChange(e)}
          className={styles.bodytext}
        />
        <input type="submit" value="Submit" className={styles.submit} />
      </form>
    );
  }
}

export default WritingForm;
