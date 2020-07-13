class WritingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val_name: "",
      val_email: "",
      val_body: ""
    };
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ val_body: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const data = {
      form_name: "post-form",
      val_name: this.state.val_name,
      val_email: this.state.val_email,
      val_body: this.state.val_body
    };
    await fetch("http://localhost:8888/", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      redirect: "follow",
      body: JSON.stringify(data)
    }).catch(error => console.log(error));
  }

  render() {
    return (
      <form method="post" onSubmit={e => this.handleSubmit(e)}>
        <label>
          Essay:
          <textarea
            value={this.state.val_body}
            onChange={e => this.handleChange(e)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default WritingForm;
