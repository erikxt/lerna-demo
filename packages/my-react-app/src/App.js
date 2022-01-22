import React, { useState } from 'react';
import { Button, Modal, List, PageHeader, Popconfirm, message, notification } from 'antd';
import './App.less';
var data = Array.from(require('./data.json'))

class App extends React.Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      isModalVisible: false,
      lists: [],
      totalCount: 0,
      current: 1,
      pageSize: 5,
      deleteId: 0
    };
  }

  getPage = (current, pageSize) => {
    let start = (current - 1) * pageSize;
    let totalPage = Math.ceil(data.length / pageSize);
    let end = (current === totalPage) ? data.length : start + pageSize;
    return data.slice(start, end);
  }

  componentDidMount() {
    this.setState({ totalCount: data.length, lists: this.getPage(this.state.current, this.state.pageSize) });
  }

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleOk = () => {
    this.setState({ isModalVisible: false });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState({ current: current, pageSize: pageSize, lists: this.getPage(current, pageSize) });
  }

  onChange = (current, pageSize) => {
    this.setState({ current: current, pageSize: pageSize, lists: this.getPage(current, pageSize) });
  }

  showTotal = (total) => {
    return `Total ${total} items`;
  }

  deleteCountAndRefresh = () => {
    let count = this.state.totalCount;
    let pageSize = this.state.pageSize;
    let current = this.state.current;
    let newCount = count - 1;
    if (newCount % pageSize === 0 && current > 1) {
      current -= 1;
    }
    this.setState({ current: current, pageSize: pageSize, totalCount: newCount, lists: this.getPage(current, pageSize) });
    this.showTotal();
  }

  closeNotification = () => {
    console.log(
      'Notification was closed. Either the close button was clicked or duration time elapsed.',
    );
  };

  openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" size="small" onClick={() => notification.close(key)}>
        Confirm
      </Button>
    );
    notification.open({
      message: 'Notification Title',
      description:
        'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
      btn,
      key,
      onClose: this.closeNotification,
    });
  };

  render() {
    const totalCount = this.state.totalCount;
    const paginationProps = {
      showSizeChanger: true,
      defaultCurrent: 1,
      defaultPageSize: 5,
      total: totalCount,
      pageSizeOptions: [5, 10, 20, 50],
      onShowSizeChange: this.onShowSizeChange,
      showTotal: this.showTotal,
      onChange: this.onChange
    }
    return (
      <div className="App" >
        <div className='wrap'>
          <p>TotalCount: {this.state.totalCount}</p>
          <Button type="primary" onClick={this.showModal}>Open Modal</Button>
          <Modal title="modal"
            visible={this.state.isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}>
            <PageHeader
              className="site-page-header"
              onBack={() => null}
              title="Title"
              subTitle="This is a subtitle"
            />
            <List
              bordered
              dataSource={this.state.lists}
              pagination={paginationProps}
              renderItem={item =>
                <List.Item >
                  <span>
                    {item.id}
                  </span>
                  <span>
                    {item.name}
                  </span>
                  <DeleteBotton
                    id={item.id}
                    onClicked={this.deleteCountAndRefresh.bind(this)}
                  />
                </List.Item>}
            />

          </Modal>
        </div>
      </div>
    )
  }
}

class DeleteArea extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPreConfirmModalVisible: false,
      isPopConfirmVisible: false
    }
  }

  confirm = () => new Promise(resolve => {
    // setTimeout(() => { resolve() }, 1000);
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      console.log(obj, this.props.id)
      if (obj.id === this.props.id) {
        console.log("hit", obj.id)
        data.splice(i, 1);
      }
    }
    // console.log(data);
    this.props.onClicked();
    message.success("delete " + this.props.id);
    this.setState({isPopConfirmVisible : false})
    resolve();
  });

  cancel = () => {
    this.setState({ isPopConfirmVisible: false });
  };

  deleteClick = () => {
    this.showPreModal();
  }

  showPreModal = () => {
    this.setState({ isPreConfirmModalVisible: true });
  };

  handlePreOk = () => {
    this.setState({ isPreConfirmModalVisible: false, isPopConfirmVisible: true });
  };

  handlePreCancel = () => {
    this.setState({ isPreConfirmModalVisible: false });
  };

  render() {
    return (
      < div >
        <div className='preConfirm'>
          <Modal title="preConfirm"
            visible={this.state.isPreConfirmModalVisible}
            onOk={this.handlePreOk}
            onCancel={this.handlePreCancel}>
            <p>preConfirm?</p>
          </Modal>
        </div>
        <Popconfirm
          title={"Are you sure to delete this task ? id =" + this.props.id}
          visible={this.state.isPopConfirmVisible}
          // onVisibleChange={this.handleVisibleChange}
          onConfirm={this.confirm}
          onCancel={this.cancel}
          okText="Yes"
        >
          <Button type='text' value={this.props.id} onClick={this.deleteClick}>delete</Button>
        </Popconfirm>
      </div >
    )
  }
}

function DeleteBotton(props) {

  const [isPreConfirmModalVisible, setPreConfirmModalVisible] = useState(false);
  const [isPopConfirmVisible, setPopConfirmVisible] = useState(false);

  let showPreModal = () => {
    setPreConfirmModalVisible(true);
  };

  let handlePreOk = () => {
    setPreConfirmModalVisible(false);
    setPopConfirmVisible(true);
  };

  let handlePreCancel = () => {
    setPreConfirmModalVisible(false);
  };

  const confirm = () => new Promise(resolve => {
    // setTimeout(() => { resolve() }, 1000);
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      // console.log(obj, props.id)
      if (obj.id === props.id) {
        console.log("hit", obj.id)
        data.splice(i, 1);
      }
    }
    // console.log(data);
    props.onClicked();
    message.success("delete " + props.id);
    setPopConfirmVisible(false);
    resolve();
  });

  let cancel = () => {
    setPopConfirmVisible(false);
  };

  let deleteClick = () => {
    showPreModal();
  }

  return (
    < div >
      <div className='preConfirm'>
        <Modal title="preConfirm"
          visible={isPreConfirmModalVisible}
          onOk={handlePreOk}
          onCancel={handlePreCancel}>
          <p>preConfirm?</p>
        </Modal>
      </div>
      <Popconfirm
        title={"Are you sure to delete this task ? id =" + props.id}
        visible={isPopConfirmVisible}
        // onVisibleChange={this.handleVisibleChange}
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
      >
        <Button type='text' value={props.id} onClick={deleteClick}>delete</Button>
      </Popconfirm>
    </div >
  )
}

export default App;