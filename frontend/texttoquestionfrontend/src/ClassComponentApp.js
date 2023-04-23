import {Component} from "react";
import {Button, Form, Row, Col, InputGroup} from "react-bootstrap";
import request from 'superagent'
import LoadingSpinner from "./LoadingSpinner";


class ClassComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            loading: false
        }
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }

    async handleButtonClick() {
        if (this.state.loading === true) {
            console.log("loading is happneing right now")
            return;
        }
        const submissionUrl = 'http://localhost:8000/prabal/';
        const text = this.text.value

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        };
        this.setState({loading: true})
        fetch(submissionUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    questions: data.questions_generated,
                    loading: false
                })
            });
    }


    render() {
        return (
            <div>
                <Row>
                    <Col lg={{offset: 3, span: 6}}>
                        <form
                            className="form-horizontal whole-page-form"
                            role="search"
                        >
                            <Form.Group>
                                <InputGroup>
                                    <Form.Control
                                        name="q"
                                        type="text"
                                        ref={(ref) => this.text = ref}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Button
                                onClick={this.handleButtonClick}
                            >
                                Create questions
                            </Button>
                        </form>
                        The following questions was created from that text.
                        {
                            this.state.questions[0]
                        }
                        {
                            this.state.loading ? <LoadingSpinner/> : null
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ClassComponent;