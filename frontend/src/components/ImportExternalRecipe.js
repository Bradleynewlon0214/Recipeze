import React, {useState} from 'react';
import axios from 'axios';
import { SERVER } from '../utils/server';
import { Form, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';

const ImportExternalRecipe = (props) => {
    const [url, setUrl] = useState();
    
    function submitRecipe(){
        let data = new FormData();
        data.append("recipeUrl", url);
        axios({
            method: 'post',
            url: `${SERVER}/api/recipes/external`,
            data: data,
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(response => {
            if(response.status === 201){
                props.history.push(`/recipe/${response.data.id}`)
            } else if(response.status === 200){
                props.history.push(`/recipe/${response.data.recipe}`)
            }
        })
        .catch(error => {
            console.log(error.response.data);
        })
    }

    function handleUrlChange(e) {
        setUrl(e.target.value)
    }

    return(
        <Form>
            <Form.Item>
                <Input disabled value={url} onChange={handleUrlChange} placeholder="Enter a link to an external recipe" />
            </Form.Item>
            <Button disabled onClick={submitRecipe} type="primary" style={{ float: "right" }} >
                Submit
            </Button>
            <Form.Item>
                <ul>
                    <li>Please enter a valid URL!</li>
                </ul>
            </Form.Item>
        </Form>
    );
}

export default withRouter(ImportExternalRecipe);