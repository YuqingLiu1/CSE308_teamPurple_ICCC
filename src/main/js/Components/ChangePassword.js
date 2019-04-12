import React, { Component } from 'react';
import '../../resources/static/css/App.css';

class ChangePassword extends Component{
    render(){
        return(
            <div class="form1">
                <form>
                    <h3 style={{"text-align":"center", "color":"black"}}>Change Password</h3>
                    <div class="changePasswordDiv">
                        <label class="changePasswordLabel">Password</label>
                        <br/>
                        <input type="password" className="form-control" class="changePasswordInput"/>
                    </div>
                    <div class="editDiv">
                        <label class="changePasswordLabel">Enter Password Again</label>
                        <br/>
                        <input type="password" className="form-control" class="changePasswordInput"/>
                    </div>
                    <br/>
                    <button type="submit" className="btn btn-primary" class="changePasswordBtn">change</button>
                </form>
            </div>
        );
    }
}

export default ChangePassword;