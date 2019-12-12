﻿import React from 'react'
import { withRouter } from 'react-router-dom'


// dependencys
import Axios from 'axios'
import PropTypes from 'prop-types'

// Components Childs
import Modal from '../../components/Modal'

const initState = {
    modalDisplay: true,
    loader: false,
    login: '',
    notFound: {
        status: false,
        msg: 'Login incorreto ou inexistente.'
    }
}

class UserLogin extends React.Component
{

    constructor (props)
    {
        super(props)
        this.state = {
            ...initState
        }
    }

    getUser = () =>
    {
        Axios.get(this.props.data.apiEndpoint + 'findbylogin/' + this.state.login)
            .then(response =>
            {
                if (response.data.id) this.props.dataFlow(response.data)
            })
            .catch((err) =>
            {
                if (err.response.data.code === 404) this.setState(prevState => (
                    { notFound: { ...prevState.notFound, status: true } }
                ))
            })
            .finally(() => { this.setState({ loader: false }) })
    }

    submitForm = () =>
    { 
        this.setState(prevState => ({
            notFound: { ...prevState.notFound, status: false },
            loader: true
        }), () => { return this.state.login ? this.getUser() : false})
    }

    modalBuild = () =>
    {
        return (
            <React.Fragment>
                <div className="modal-body form">
                    <div className="field-group">
                        <label>Área do funcionário</label>
                    </div>
                    <div className="field-group">
                        <label>Login *</label>
                        <input
                            type="text"
                            name="login"
                            onChange={ (e) => this.setState({ login: e.target.value }) }
                            value={ this.state.login }
                        />
                    </div>
                    <div className="field-group">
                        <span>{ this.state.notFound.status ? this.state.notFound.msg : '⠀' }</span>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        className="btn btn-primary full"
                        onClick={ () => this.submitForm() }
                    >
                        { this.state.loader ? <i className="fa fa-spinner fa-pulse"></i> : 'login' }
                    </button>
                </div>
            </React.Fragment>
        )
    }

    componentDidUpdate = () => this.props.data.user.id ? this.props.history.push('/user/panel') : false

    render = () =>
    {
        return (
            <div className="main">
                <Modal display={ this.state.modalDisplay }>
                    { this.modalBuild() }
                </Modal>
            </div>
        )
    }
}

export default withRouter(UserLogin)

UserLogin.propTypes = {
    dataFlow: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}
