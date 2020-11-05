import React, {useState} from 'react';
import { Button, Checkbox, Input, Form, Modal, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Fraction } from 'fractional';
import axios from 'axios';
import { SERVER } from '../utils/server';
import { validateEmail } from '../utils/Validator';


const download = (content, fileName, mimeType) => {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if(navigator.msSaveBlob){
        navigator.msSaveBlob(new Blob([content], {
            type: mimeType
        }), fileName);
    } else if(URL && 'download' in a){
        a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        a.href = 'data:application/octet-stream,' + encodeURIComponent(content);
    } 
}

const writeMenu = (recipes, ingredients, email) => {
    var content = '';
    var template = [
        "==== ______ ======== _ =============================== _ ====\n",
        "==== | ___ \\ ====== (_) ============================= | | ===\n",
        "==== | |_/ /___  ___ _ _ __   ___ _______   _ __   ___| |_ ==\n",
        "==== |    // _ \\/ __| | '_ \\ / _ \\_  / _ \\ | '_ \\ / _ \\ __| =\n",
        "==== | |\\ \\  __/ (__| | |_) |  __// /  __/_| | | |  __/ |_ ==\n",
        "==== \\_| \\_\\___|\\___|_| .__/ \\___/___\\___(_)_| |_|\\___|\\__| =\n",
        "=================== | | =====================================\n",
        "=================== |_| =====================================\n",
    ]
    if(!email){
        template.forEach(value => {
            content += value;
        });
    }

    content += '\n';
    content += 'Your Menu:\n';
    recipes.forEach( recipe => {
        content += recipe + '\n';
    })


    content += '\n';
    content += 'Ingredients you will need:\n';
    // ingredients.forEach( value => {
    //     content += value + '\n';
    // })
    content += ingredients + '\n';
    return content;
}


const ExportIngredients = ({disabled, loading, getIngredients, recipes}) => {

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [method, setMethod] = useState(null);
    const [email, setEmail] = useState(null);

    const stageMenu = (isEmail) => {
        var ingredients = getIngredients();
        var ingredientKeys = Object.keys(ingredients);
        var ingredientList = "";
        ingredientKeys.forEach(item => {
            var obj = ingredients[item];
            obj.forEach(o => {
                if(o.quantity !== undefined && o.measurement !== undefined && o.ingredient !== undefined){
                    var fraction;
                    if(o.quantity.includes && o.quantity.includes('.')){
                        var f = (o.quantity === '.6666666666666666') ? '2/3' : new Fraction(Math.round(Number(o.quantity)*100)/100);
                        fraction = (f === '2/3') ? '2/3' : f.numerator + '/' + f.denominator;
                    } else{
                        fraction = o.quantity;
                    }
                    ingredientList += fraction + " " + o.measurement + " " + o.ingredient + '\n';
                }
            });
        });
        return writeMenu(recipes, ingredientList, isEmail);
    }

    const sendMail = () => {
        var data = new FormData();

        if(validateEmail(email)){
            data.append("to", email);
            data.append("menu", stageMenu(true));
            axios({
                method: 'post',
                url: `${SERVER}/api/grocerylist/email`,
                data: data,
                headers: {'Content-Type': 'multipart/form-data'}
            })
            .then(response => {
            })
            .catch(error => {
                // console.log(error);
                // console.log(error.response);
            })
            return [true, "Grocery list sent!"];
        } else{
            return [false, "Please enter a valid email address!"] ;
        }
    }

    const onFinish = () => {
        setConfirmLoading(true);
        var success = false;
        switch(method){
            case "textFile":
                download(stageMenu(false), 'menu.txt', 'data:text/plain;encoding:utf-8')
                success = true;
                break;
            case "email":
                const [truth, msg] = sendMail();
                (truth) ? message.success(msg) : message.error(msg);
                success = (truth) ? true: false;
                break;
            default:
                message.error("No method selected!");
        }
        if(success){
            setConfirmLoading(false);
            setVisible(false);
        } else {
            setConfirmLoading(false);
        }
    }

    return(
        <div style={{ float: 'right' }}>
            <Button
                type="primary" 
                onClick={() => setVisible(true)}
                disabled={disabled}
                loading={loading}
                
            >
                Export Grocery List
            </Button>
            <Modal
                confirmLoading={confirmLoading}
                onCancel={() => setVisible(false)}
                visible={visible}
                footer={[
                    <Button key="back" onClick={() => setVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" onClick={onFinish}>
                        Export
                    </Button>
                ]}
            >
                <Form>
                    <Form.Item>
                        <p>Select how you would like to export your grocery list!</p>
                    </Form.Item>
                    <Form.Item name="method">
                        <Checkbox onChange={(e) => (e.target.checked === true) ? setMethod("textFile") : setMethod(null)} disabled={ (method === "email") ? true : false } >Text File</Checkbox>
                        <Checkbox onChange={(e) => (e.target.checked === true) ? setMethod("email") : setMethod(null)} disabled={ (method === "textFile") ? true : false }>Email</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Input prefix={<MailOutlined />} disabled={ (method === "email") ? false : true } type="text" placeholder=" Email" onChange={(e) => setEmail(e.target.value)} value={email} />
                    </Form.Item>
                </Form>
                
            </Modal>
        </div>
    );


};
export default ExportIngredients;