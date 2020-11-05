import React, {useState, useRef} from 'react';
import { message, Modal, Form, Button, Input, Select} from 'antd';
import { FlagOutlined } from '@ant-design/icons';

import axios from 'axios';
import { SERVER } from '../utils/server';

const { Option } = Select;

const ReportRecipe = ({ recipeID }) => {
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState("");
    const [confirmLoading, setConfirmLoading] = useState(false);
    const formEl = useRef(null);

    function handleFormSubmit(event){
      setConfirmLoading(true);
      event.preventDefault();
      const problem = formEl.current.getFieldValue("problem");
      const description = formEl.current.getFieldValue("description");

      axios.post(`${SERVER}/api/reports/create/`, {
        post_id: recipeID,
        problem: problem,
        description: description
      })
      .then(response => {
        message.success('Report/Bug submitted. Thank you for your feedback!', response);
      })
      .catch(error => {
        message.error("Something went wrong!", error)
      });
      
      setVisible(false);
    }

    return(
        <div>
          <FlagOutlined  style={{ color: `${color}` }} onClick={() => {setVisible(true); setColor("red");  }}/>
          <Modal
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={() => {setVisible(false); setColor("")  }}
            footer={[
            <Button key="back" onClick={() => {setVisible(false); setColor(""); }}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" htmlType="submit" loading={confirmLoading} onClick={handleFormSubmit}>
              Submit Report
            </Button>,
            ]}
          >
            <Form ref={formEl} name="reportForm" layout="vertical" hideRequiredMark>

              <Form.Item
                name="problem"
                label="Problem"
                rules={[{ required: true, message: 'Please select the problem' }]}
              >
                <Select placeholder="Please select the problem." name="problem">
                  <Option value="I">Image Problem</Option>
                  <Option value="IN">Ingredients Problem</Option>
                  <Option value="S">Steps Problem</Option>
                  <Option value="N">Nutrition Problem</Option>
                  <Option value="T">Title Problem</Option>
                  <Option value="O">Other Problem</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
              >
                <Input.TextArea rows={4} placeholder="Provide a brief description, if you would like." />
              </Form.Item>

            </Form>
          </Modal>
        </div>

    );

}


// class ReportRecipe extends React.Component {

//     constructor(props){
//         super(props);
//         this.formRef = React.createRef();
//         this.recipeID = this.props.recipeID;
//         this.state = {
//             visible: false,
//         }
//         this.showDrawer = this.showDrawer.bind(this);
//         this.onClose = this.onClose.bind(this);
//         this.handleFormSubmit = this.handleFormSubmit.bind(this);
//     }

//     componentDidUpdate(prevProps) {
//       if(prevProps.recipeID !== this.props.recipeID){
//         this.setState({
//           recipeID: this.props.recipeID,
//         })
//       }
//     }

//     showDrawer(){
//         this.setState({
//             visible: true,
//             color: "red",
//         });
//     }

//     onClose(){
//         this.setState({
//             visible: false,
//         });
//     }

    // handleFormSubmit(event){
    //   event.preventDefault();
    //   const problem = this.formRef.current.getFieldValue("problem");
    //   const description = this.formRef.current.getFieldValue("description");
      
    //   axios.post(`${SERVER}/api/reports/create/`, {
    //     post_id: this.recipeID,
    //     problem: problem,
    //     description: description
    //   })
    //   .then(response => console.log(response))
    //   .catch(error => message.error("Something went wrong!"));
      

    //   this.onClose();
    //   message.success('Report/Bug submitted. Thank you for your feedback!');
    // }

//     render(){
//         return(
//             <>
//             <FlagOutlined onClick={this.showDrawer}/>
//             <Modal
//               title="Report Recipe/Bug"
//               width={720}
//               onCancel={this.onClose}
//               visible={this.state.visible}
//               bodyStyle={{ paddingBottom: 80 }}
//               footer={
//                 <div
//                   style={{
//                     textAlign: 'right',
//                   }}
//                 >

//                   <Button onClick={this.onClose} style={{ marginRight: 8 }}>
//                     Cancel
//                   </Button>

//                   <Button htmlType="submit" onClick={this.handleFormSubmit} type="primary">
//                     Submit
//                   </Button>

//                 </div>
//               }
//             >

              // <Form ref={this.formRef} name="reportForm" layout="vertical" hideRequiredMark>
              //   <Row gutter={16}>
              //     <Col span={24}>
              //       <Form.Item
              //         name="problem"
              //         label="Problem"
              //         rules={[{ required: true, message: 'Please select the problem' }]}
              //       >
              //         <Select placeholder="Please select the problem." name="problem">
              //           <Option value="I">Image Problem</Option>
              //           <Option value="IN">Ingredients Problem</Option>
              //           <Option value="S">Steps Problem</Option>
              //           <Option value="N">Nutrition Problem</Option>
              //           <Option value="T">Title Problem</Option>
              //           <Option value="O">Other Problem</Option>
              //         </Select>
              //       </Form.Item>
              //     </Col>
              //   </Row>
              //   <Row gutter={16}>
              //     <Col span={24}>
              //       <Form.Item
              //         name="description"
              //         label="Description"
              //       >
              //         <Input.TextArea rows={4} placeholder="Provide a brief description, if you would like." />
              //       </Form.Item>
              //     </Col>
              //   </Row>
              // </Form>

//             </Modal>
//           </>
//         );
//     }

// }

export default ReportRecipe;