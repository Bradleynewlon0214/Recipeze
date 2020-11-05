import React from 'react';
import { connect } from 'react-redux';
import { authAxios } from '../utils/authAxios';
import axios from 'axios';
import { SERVER } from '../utils/server';
import {Input, Card, Row, Col, Form, Button, InputNumber, Select, Upload, message} from 'antd';
import { PlusOutlined, CloseOutlined, UploadOutlined} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

// import ImportExternalRecipe from '../components/ImportExternalRecipe';


class AddRecipe extends React.Component {
    //Use this to check images, maybe
    // beforeUpload(file) {
    //     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //     if (!isJpgOrPng) {
    //       message.error('You can only upload JPG/PNG file!');
    //     }
    //     const isLt2M = file.size / 1024 / 1024 < 2;
    //     if (!isLt2M) {
    //       message.error('Image must smaller than 2MB!');
    //     }
    //     return isJpgOrPng && isLt2M;
    // }


    constructor(props){
        super(props);
        this.state = {
            uploaded: false,
            recipeName: "",
            description: "",
            steps: [], //{name: ""}
            ingredients: [], //{ingredient: "", measurement: "", quantity: ""}
            selectedTags: [],
            tags: [],
            nutrition: {},
            image: "",
            image_file: '',
            userID: 1,
            recipeYield: 0,
        }
    }

    componentDidMount(){
        document.title = "Add Recipe";
        axios.get(`${SERVER}/api/tags/`)
        .then(res => {
            this.setState({
                tags: res.data
            })
        })
        this.getUserData();
    }


    getUserData = () => {
        const { isAuthenticated } = this.props;
        
        if(isAuthenticated){
            authAxios.get('/rest-auth/user/')
            .then(response => {
                this.setState({ 
                    userID: response.data.pk,
                })
            })
        } else {
            this.setState({
                userID: 1,
            })
        }
    }

    handleStepChange = (e) => {
        if(["name"].includes(e.target.name)){
            let steps = [...this.state.steps];
            steps[e.target.dataset.id][e.target.name] = e.target.value;
            this.setState({steps});
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    handleIngredientChange = (e, id, name) => {
        if(["quantity"].includes(name)){
            let ingredients = [...this.state.ingredients];
            ingredients[id][name] = e
            this.setState({ingredients});
        } else {
            this.setState({ [name]: e });
        }
    }

    handleIngredientNameChange = (e) => {
        if(["ingredient", "measurement"].includes(e.target.name)){
            let ingredients = [...this.state.ingredients];
            ingredients[e.target.dataset.id][e.target.name] = e.target.value;
            this.setState({ ingredients });
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    handleRemove = (e) => {
        let steps = [...this.state.steps];
        let index = e.target.dataset.id;
        steps.splice(index, 1);
        this.setState({ steps });
    }

    handleIngredientRemove = (e) => {
        let ingredients = [...this.state.ingredients];
        let index = e.target.dataset.id;
        ingredients.splice(index, 1);
        this.setState({ingredients});
    }

    addStep = (e) => {
        this.setState((prevState) => ({
            steps: [...prevState.steps, {name: ""}],
        }));
    }

    addIngredient = (e) => {
        this.setState((prevState) => ({
            ingredients: [...prevState.ingredients, {ingredient: "", measurement: "", quantity: ""}]
        }));
    }


    slug = (str) => {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
      
        // remove accents, swap ñ for n, etc
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        var to   = "aaaaaeeeeeiiiiooooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
          str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
      
        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
          .replace(/\s+/g, '-') // collapse whitespace and replace by -
          .replace(/-+/g, '-'); // collapse dashes
      
        return str;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {recipeName, description, steps, ingredients, selectedTags, nutrition, image_file, userID, recipeYield, perServing } = this.state;
        const [truth, msg] = this.beforeUpload(image_file);

        if(truth){ 
            var data = new FormData();
            let stepsArray = [];
            steps.forEach(item => {
                stepsArray.push(item.name);
            });

            let stepsString = stepsArray.join(" ");

            let ingredient_strings = [];
            ingredients.forEach(ingredient => {
                let ingred = [];
                ingred.push(ingredient.quantity);
                ingred.push(ingredient.measurement);
                ingred.push(ingredient.ingredient);
                ingredient_strings.push(ingred.join(" "));
            });
            
            let tags_objects = [];
            selectedTags.forEach(tag => {
                tags_objects.push({'tag': tag, 'tag_slug': this.slug(tag)})
            });

            data.append('name', recipeName);
            data.append('user', userID);
            data.append('description', description);
            data.append('steps', stepsString);
            data.append('ingredients', JSON.stringify(ingredient_strings));
            data.append('ingredients_cleaned', JSON.stringify(ingredients));
            data.append('tags', JSON.stringify(tags_objects));
            data.append('nutrition', nutrition);
            data.append('picture_link', image_file);
            data.append('yields', recipeYield);
            data.append('per_serving', perServing);
            data.append('link', 'recipeze.net');
            axios({
                method: 'post',
                url: `${SERVER}/api/recipe/create/`,
                data: data,
                headers: {'Content-Type': 'multipart/form-data'}
            })
            .then(response => {
                console.log(response);
                this.props.history.push(`/recipe/${response.data.id}`)
            })
            .catch(error => {
                message.error("Something went wrong!", error);
            });
        } else {
            message.error(msg);
        }
    }

    handleNutrition = (value, key) => {
        if(key === "Servings"){
            this.setState({
                perServing: value,
            })
        } else {
            let nutrition = this.state.nutrition;
            nutrition[key] = value;
            this.setState({
                nutrition
            })
        }
    }

    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            return [false, 'You can only upload JPG/PNG/GIF file!'];
        }
        const isLt2M = file.size / 1024 / 1024  < 50;
        if (!isLt2M) {
            return [false, 'Image must smaller than 50MB!'];
        }
        return [isJpgOrPng && isLt2M, 'Success!'];
    }

    previewFile = (e) => {
        var file = e.file.originFileObj;
        var reader = new FileReader();
        // var truth = this.beforeUpload(file);

        // var file = document.querySelector('input[type=file]').files[0];

        if(true){
            reader.onloadend = function() {
                this.setState({
                    image: reader.result,
                    uploaded: true,
                    image_file: file
                })
            }.bind(this);
    
            if(file){
                reader.readAsDataURL(file);
            } else {
                this.setState({
                    image: "",
                    uploaded: false,
                    image_file: ''
                })
            }
        }
    }

    handleImageRemove = () => {
        this.setState({
            image: "",
            uploaded: false,
            image_file: '',
        })
    }

    handleYieldChange = (e) =>{
        this.setState({
            recipeYield: e,
        })
    }

    render(){
        let { steps, ingredients, recipeName, description, selectedTags } = this.state;
        const { Option } = Select;
        const TAGS = this.state.tags;
        const filteredTags = TAGS.filter(o => !selectedTags.includes(o.tag))
        return(
            <div>
                <Card>
                    <h1>Add your own recipe!</h1>
                </Card>
                <Form encType="multipart/form-data">
                    <Card title={<Input placeholder="Recipe Name" name="recipe-name" value={recipeName} onChange={(e) => { this.setState({recipeName: e.target.value}) }}/>}>
                        <Row>
                            <Col flex="0 1 500px" style={{ padding: "0% 1% 2% 0%" }}>
                                {
                                    (this.state.uploaded) ? 
                                    <div>
                                        <img src={this.state.image} style={{ width: '100%', height: '100%' }} alt="Recipe Preview"/>
                                        <CloseOutlined onClick={this.handleImageRemove}  />
                                    </div>
                                    :
                                    <Upload name="file" type="file" accept=".jpg,.png,.gif" onChange={this.previewFile}>
                                        <Button>
                                            <UploadOutlined/> Upload
                                        </Button>
                                    </Upload>
                                }
                                
                            </Col>
                            <Col flex="1 1 500px">
                                <Form.Item>
                                    <TextArea rows={7} placeholder="Description" name="description" value={description} onChange={(e) => { this.setState({description: e.target.value}) }}/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col flex="1 1 500px" style={{ padding: "0% 1% 0% 0%" }}>
                                <Form.Item>
                                    <Button type="dashed" onClick={this.addIngredient}>
                                        <PlusOutlined /> Add Ingredient
                                    </Button>
                                </Form.Item>
                                {
                                    ingredients.map((val, idx) => {
                                        return(
                                            <Form.Item>
                                                <div style={{ width: "100%" }}>
                                                    <InputNumber 
                                                        min={0} max={10} step={0.25}
                                                        style={{ width: "10%", margin: "0% 1% 0% 0%"}}
                                                        onChange={(e) => {this.handleIngredientChange(e, idx, "quantity")}}
                                                        placeholder="#"
                                                    />
                                                    <Input 
                                                        placeholder="Unit"
                                                        style={{ width: "20%", margin: "0% 1% 0% 0%"}}
                                                        onChange={this.handleIngredientNameChange}
                                                        name="measurement"
                                                        data-id={idx}
                                                    />
                                                    <Input 
                                                        placeholder="Ingredient Name" 
                                                        style={{ width: "65%", margin: "0% 1% 0% 0%"}}
                                                        onChange={this.handleIngredientNameChange}
                                                        name="ingredient"
                                                        data-id={idx}
                                                    />
                                                    <CloseOutlined
                                                        style={{ width: "2%" }}
                                                        data-id={idx} 
                                                        onClick={this.handleIngredientRemove}
                                                    />
                                                </div>
                                            </Form.Item>
                                        )
                                    })
                                }
                            </Col>

                            <Col flex="1 1 500px">
                                <Form.Item>
                                    <Button type="dashed" onClick={this.addStep}>
                                        <PlusOutlined />Add Step
                                    </Button>
                                </Form.Item>
                                {
                                    steps.map((val, idx) => {
                                        let stepId = `step-${idx}`; 

                                        return(
                                            <Form.Item>
                                                <div key={idx} style={{ width: "100%" }}>
                                                    <TextArea
                                                        type="text"
                                                        onChange={this.handleStepChange}
                                                        data-id={idx}
                                                        id={stepId}
                                                        style={{ width: "97%", margin: "0% 1% 0% 0%" }}
                                                        name="name"
                                                        placeholder={`Step ${idx + 1}`}
                                                    />
                                                    <CloseOutlined
                                                        style={{ width: "2%" }}
                                                        data-id={idx} 
                                                        onClick={this.handleRemove}
                                                    />
                                                </div>
                                            </Form.Item>
                                        )
                                    })
                                }
                            </Col>
                        </Row>

                        
                        <Row style={{ margin: "0% 0% 1% 0%" }}>
                            <Col flex="1 1 500px" style={{ padding: "0% 1% 0% 0%" }}>
                                <Form.Item> <InputNumber min={0} placeholder="Yield" onChange={this.handleYieldChange} /> </Form.Item> 
                            </Col>
                            <Col flex="1 1 500px">
                                
                                <Row style={{ margin: "0% 0% 1% 0%" }}>
                                <Col span={12}><InputNumber style={{ width:"95%" }} onChange={(value) => this.handleNutrition(value, "Calories")} min={0} step={1} placeholder="Calories"/>      </Col>
                                <Col span={12}><InputNumber style={{ width:"93%" }} onChange={(value) => this.handleNutrition(value, "Servings")} min={0}  step={1} placeholder="# Servings"/>   </Col>
                                </Row>
                                
                                <Row style={{ margin: "0% 0% 1% 0%" }}>
                                <Col span={8}><InputNumber style={{ width:"90%" }} onChange={(value) => this.handleNutrition(value, "Carbohydrates")} min={0} step={1} placeholder="Carbohydrates"/></Col>
                                <Col span={8}><InputNumber style={{ width:"90%" }} onChange={(value) => this.handleNutrition(value, "Fat")} min={0} step={1} placeholder="Fat"/>                    </Col>
                                <Col span={8}><InputNumber style={{ width:"90%" }} onChange={(value) => this.handleNutrition(value, "Protien")} min={0} step={1} placeholder="Protien"/>            </Col>
                                </Row>
                                
                                <Row style={{ margin: "0% 0% 1% 0%" }}>
                                <Col span={8}><InputNumber style={{ width:"90%" }} onChange={(value) => this.handleNutrition(value, "Sodium")} min={0} step={1} placeholder="Sodium"/>          </Col>
                                <Col span={8}><InputNumber style={{ width:"90%" }} onChange={(value) => this.handleNutrition(value, "Fiber")} min={0} step={1} placeholder="Fiber"/>            </Col>
                                <Col span={8}><InputNumber style={{ width:"90%" }} onChange={(value) => this.handleNutrition(value, "Cholesterol")} min={0} step={1} placeholder="Cholesterol"/></Col>
                                </Row>
                                
                                <Row style={{ margin: "0% 0% 1% 0%" }}>
                                <Col span={8}><InputNumber style={{ width:"90%" }} onChange={(value) => this.handleNutrition(value, "SaturatedFat")} min={0} step={1} placeholder="SaturatedFat"/>  </Col>
                                <Col span={8}><InputNumber style={{ width:"90%" }} onChange={(value) => this.handleNutrition(value, "MonoFat")} min={0} step={1} placeholder="MonoFat"/>            </Col>
                                <Col span={8}><InputNumber style={{ width:"90%" }} onChange={(value) => this.handleNutrition(value, "PolyFat")} min={0} step={1} placeholder="PolyFat"/>            </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row style={{ margin: "0% 0% 1% 0%" }}>
                            <Col span={24}>
                                <Select
                                    mode="multiple"
                                    placeholder="Add tags to your recipe"
                                    value={selectedTags}
                                    onChange={ (selectedTags) => { console.log(selectedTags); this.setState({selectedTags}) }}
                                    style={{ width: "100%" }}
                                >
                                    {filteredTags.map(item => (
                                        <Option key={item.slug} value={item.tag}>
                                            {item.tag}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>


                        <Button type="primary" style={{ float: "right" }} onClick={this.handleSubmit}>
                            Submit
                        </Button>

                    </Card>
                </Form>

                {/* <Divider />
                <Card><h1>Or add a Recipe from another site!</h1></Card>
                <Card>
                    <ImportExternalRecipe />
                </Card> */}
                
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null,
    }
}

export default connect(mapStateToProps)(AddRecipe);