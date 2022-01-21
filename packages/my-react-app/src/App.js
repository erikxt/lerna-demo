import React from 'react';
import { Button, Modal, List, PageHeader, Popconfirm, message } from 'antd';
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

  onShowSizeChange(current, pageSize) {
    this.setState({ current: current, pageSize: pageSize, lists: this.getPage(current, pageSize) });
  }

  onChange = (current, pageSize) => {
    this.setState({ current: current, pageSize: pageSize, lists: this.getPage(current, pageSize) });
  }

  showTotal = (total) => {
    return `Total ${total} items`;
  }

  deleteCountAndRefresh = () => {
    let current = this.state.current;
    let pageSize = this.state.pageSize;
    let count = this.state.totalCount;
    this.setState({ current: current, pageSize: pageSize, totalCount: count - 1, lists: this.getPage(current, pageSize)});
    this.showTotal();
  }

  render() {
    const totalCount = this.state.totalCount;
    const paginationProps = {
      showSizeChanger: true,
      defaultCurrent: 1,
      defaultPageSize: 5,
      onShowSizeChange: this.onShowSizeChange,
      total: totalCount,
      showTotal: this.showTotal,
      onChange: this.onChange,
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
                  <DeleteArea id={item.id} onClicked={this.deleteCountAndRefresh.bind(this)} />
                </List.Item>}
            />
          </Modal>
        </div>
      </div>
    )
  }
}

class DeleteArea extends React.Component {

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
    resolve();
  });

  deleteClick = () => {
    // message.success("delete" + this.props.id);
  }

  render() {
    return (
      < div >
        <Popconfirm
          title={"Are you sure to delete this task ? id =" + this.props.id}
          onConfirm={this.confirm}
          okText="Yes"
        >
          <Button type='text' value={this.props.id} onClick={this.deleteClick}>delete</Button>
        </Popconfirm>
      </div >
    )
  }
}

export default App;