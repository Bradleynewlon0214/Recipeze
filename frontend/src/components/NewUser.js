import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';


const NewUser = () => {
    const [visited, setVisted] = useState(false);
    const [visible, setVisible] = useState(null);


    useEffect(() => {
        const visitLocal = localStorage.getItem('visited');
        setVisted(visitLocal);
        if(visitLocal === null){
            setVisible(true);
        }
    }, [visited]);

    const handleOk = () => {
        setVisible(false);
        localStorage.setItem('visited', true);
    } 

    return(
        <Modal
            title="Hello, it looks like you're new here!"
            visible={visible}
            onOk={handleOk}
            onCancel={handleOk}
            footer={[
                <Button type="primary" key="submit" onClick={handleOk}>
                    Okay
                </Button>
            ]}
        >
        <p>
            Welcome to Recipeze.net! This website is designed to help you shorten your grocery list. When you view a recipe, the similar recipes below will be ones that use fewer new ingredients. Then, when you star a recipe, you can view them in the Saved Recipes tab and from here you can view your ingredient list or export it.
        </p>            

        <p>
            Also, the Home tab lists all of the recipes on the site but feel free to add your own or search for new ones in the Discover tab!
        </p>
        </Modal>
    );

}

export default NewUser;