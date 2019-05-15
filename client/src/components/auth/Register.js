import React, { Component } from 'react';
import axios from 'axios';
import TextFieldGroup from '../common/TextFieldGroup';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import { withRouter } from 'react-router-dom';
class Register extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			errors: {},
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit(e) {
		e.preventDefault();

		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2,
		};

		this.props.registerUser(newUser, this.props.history);
		// axios
		//     .post('/users/register', newUser)
		//     .then(res => console.log(res.data))
		//     .catch(err => this.setState({ errors: err.response.data }));
	}

	render() {
		const { errors } = this.state;
		const { user } = this.props.auth;
		return (
			<div className="register">
				{user ? user.name : null}
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Sign Up</h1>
							<p className="lead text-center">Create your DevConnector account</p>

							<form noValidate onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="Username"
									onChange={this.onChange}
									value={this.state.name}
									error={errors.name}
									name="name"
									type="name"
								/>

								<TextFieldGroup
									placeholder="Email address"
									onChange={this.onChange}
									value={this.state.email}
									error={errors.email}
									name="email"
									type="email"
								/>

								<TextFieldGroup
									placeholder="Password"
									onChange={this.onChange}
									value={this.state.password}
									error={errors.password}
									name="password"
									type="password"
								/>


								<TextFieldGroup
									placeholder="Confirm Password"
									onChange={this.onChange}
									value={this.state.password2}
									error={errors.password2}
									name="password2"
									type="password2"
								/>


								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{ registerUser }
)(withRouter(Register));
