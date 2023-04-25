import {Component} from "react";
import {Button, Form, Row, Col} from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";


class ClassComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionsAndAnswers: [],
            showAnswer: [],
            loading: false,
            error: null
        }
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleShowOrHideAnswer = this.handleShowOrHideAnswer.bind(this)
        this.shouldSendRequest = this.shouldSendRequest.bind(this)
    }

    shouldSendRequest() {
        if (this.state.loading === true) {
            return false;
        }
        if (this.text.value.length > 1000) {
            this.setState({
                error: "Error: Character limit 1000",
                questionAndAnswers: [],
                showAnswer: [],
                loading: false
            })
            return false;
        }
        this.setState({
            questionsAndAnswers: [],
            showAnswer: [],
            loading: true,
            error: null
        })
        return true;
    }

    async handleButtonClick() {
        if(!this.shouldSendRequest()) {
            return
        }

        const text = this.text.value
        const submissionUrl = 'http://3.8.15.89:3000/textToQuestion/';

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        };
        fetch(submissionUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    questionsAndAnswers: data?.questions_and_answers ? data.questions_and_answers : [],
                    showAnswer: data?.questions_and_answers ? new Array(data.questions_and_answers.length).fill(false) : [],
                    loading: false,
                })
            }).catch(error => {
                this.setState({
                    error: "Error fetching the response from the backend" + error,
                    loading: false,
                    questionAndAnswers: [],
                    showAnswer: []
                })
        });
    }

    handleShowOrHideAnswer(index) {
        const newShowAnswerArray = this.state.showAnswer
        newShowAnswerArray[index] = !this.state.showAnswer[index]
        this.setState({
            showAnswer: newShowAnswerArray
        })
    }


    render() {
        const questionsGenerated = (
            <div>
                {
                    this.state.questionsAndAnswers.map((qAndA, index) => (
                        <div className="generated-questions">
                            <Row className="question">
                                {index + 1}: {qAndA['question']}
                            </Row>
                            <Button
                                onClick={() => this.handleShowOrHideAnswer(index)}>
                                {this.state.showAnswer[index] ? "Hide Answer" : "Show Answer"}
                            </Button>
                            <Row>
                                {
                                    this.state.showAnswer[index] ? qAndA['answer'] : null
                                }
                            </Row>
                        </div>
                    ))
                }
            </div>
        )
        return (
            <div className="spinner-container">
                <Row className="header-top">
                    <strong>
                        Enter some text in this and this will generate some questions for you
                    </strong>
                </Row>
                <Row>
                    <Form>
                        <Form.Control
                            onSubmit={this.handleButtonClick}
                            as="textarea"
                            className="textarea-box"
                            ref={(ref) => this.text = ref}
                        />
                    </Form>
                    <div className="button-container">
                        <Button
                            onClick={this.handleButtonClick}
                            className="button-generate-question"
                        >
                            {this.state.loading ? 'Loading... This might take a few seconds' : 'Click to generate questions'}
                        </Button>
                    </div>

                </Row>
                <Row>
                    <Col>
                        {questionsGenerated}
                        {
                            this.state.loading ? <LoadingSpinner/> : null
                        }
                    </Col>
                    <Col className="error-bottom">
                        {this.state.error != null ? this.state.error : null}
                    </Col>
                </Row>
            </div>
        );
    }


}

export default ClassComponent;