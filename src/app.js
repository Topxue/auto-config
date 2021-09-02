import React from 'react'
import './app.less'
import logo from '../public/icon.jpg'

// 接口文档
const PORT_API = 4999
// 开发环境
const PORT_EDV = 8090
// 需求文档
const PORT_NEED = 56000

const Reg = /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/

// 排除的接口字段
const excludeAPI = ['code', 'message', 'errcode', 'errmsg', 'id']

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: true,
      containerId: '#u1750',
      pasteValue: ''
    }
  }

  handleClose = () => {
    this.setState({
      show: !this.state.show
    })
  }

  handleChangeContainerID = ({target}) => {
    this.setState({
      containerId: target.value
    })
  }

  handlePasteValue = ({target}) => {
    this.setState({
      pasteValue: target.value
    })
  }

  handlePasteData = (type) => {
    if (!this.state.pasteValue) return

    const pasteData = this.state.pasteValue.split(',')

    console.log('pasteData：', pasteData)

    const boxCard = document.querySelectorAll('.box-card')[1]
    if (!boxCard) return
    const trs = [...boxCard.querySelectorAll('tr')]

    const count = pasteData.length - trs.length

    this.createTableRows(count)

    console.log('配置列与字段相差：', count)

    // 去除表头
    if (type === 'api') {
      trs.splice(0, 2)
    } else {
      trs.shift()
    }

    // 更新设置列标题
    trs.forEach((elem, index) => {
      const childrenIndex = type === 'api' ? 2 : 1

      const input = elem.children[childrenIndex].querySelector('input')

      this.setRowTitle(input, pasteData[index])
    })
  }

  // 动态创建表格列
  createTableRows = (count) => {
    const addBtn = document.querySelector('.el-icon-plus').parentNode

    const event = document.createEvent('HTMLEvents')
    event.initEvent('click', true, true)

    for (let i = 0; i <= count; i++) {
      addBtn.dispatchEvent(event)
    }
  }

  setRowTitle = (input, value) => {
    if (!value) return

    const event = document.createEvent('HTMLEvents')
    event.initEvent('input', false, true)

    input.value = value
    input.dispatchEvent(event)
  }

  handleGetTableFiled = () => {
    const id = this.state.containerId
    if (!id) {
      return alert('请传入表格容器ID')
    }


    const tableContainer = document.querySelector(id)
    if (!tableContainer) return

    const fields = tableContainer.querySelectorAll('p')
    const fieldTexts = []

    fields.forEach(elem => {
      const text = elem.innerText
      const rule = text && Reg.test(text) && !text.includes('筛选')

      if (rule) fieldTexts.push(text)
    })

    this.handleCopyData(fieldTexts)
  }

  handleCopyData = (fieldTexts) => {
    const copyData = fieldTexts.join(',')

    if (window.clipboardData) {
      window.clipboardData.setData('text', copyData)

      console.log('Copy successful：' + copyData)
    } else {
      ;(function (copyData) {
        document.oncopy = function (e) {
          e.clipboardData.setData('text', copyData)
          e.preventDefault()
          document.oncopy = null
        }
      })(copyData)
      document.execCommand('Copy')

      console.log('Copy successful：' + copyData)
    }
  }

  handleGetApiFields = () => {
    const editorMd = document.querySelector('#editor-md')

    const panelArray = [...editorMd.querySelectorAll('p')]

    const panelDom = panelArray.length > 5 ? editorMd.querySelectorAll('p') : editorMd.querySelectorAll('h5')

    const panels = [...panelDom]

    const nextElement = panels.find(elem => elem.innerText === '返回参数说明')

    const table = nextElement.nextElementSibling.querySelector('table')

    const trs = []
    table.querySelectorAll('tr').forEach((elem, index) => {
      if (index > 0) {
        if (!excludeAPI.includes(elem.children[0].innerText)) {
          trs.push(elem)
        }
      }
    })

    // 删除错误字段
    // trs.splice(0, 5)

    const fields = trs.map(elem => elem.children[0].innerText)

    this.handleCopyData(fields)
  }


  getContainer = () => {
    const {containerId, pasteValue} = this.state

    const url = window.location.href

    if (url.includes(PORT_API)) {
      return (
        <div className="wo-koo-container">
          <input
            type="text"
            value={containerId}
            placeholder="请表格容器ID(#ID)"
            onChange={this.handleChangeContainerID}/>

          <button onClick={this.handleGetApiFields}>复制字段</button>
        </div>
      )
    } else if (url.includes(PORT_EDV)) {
      return (
        <div className="wo-koo-container-paste">
          <textarea value={pasteValue} placeholder="粘贴(Ctrl+V)" onChange={this.handlePasteValue}></textarea>

          <button onClick={this.handlePasteData}>粘贴</button>
          <button onClick={this.handlePasteData.bind(null, 'api')}>粘贴API</button>
        </div>
      )
    } else if (url.includes(PORT_NEED)) {
      return (
        <div className="wo-koo-container">
          <input
            type="text"
            value={containerId}
            placeholder="请表格容器ID(#ID)"
            onChange={this.handleChangeContainerID}/>

          <button onClick={this.handleGetTableFiled}>复制</button>
        </div>
      )
    }
  }

  render() {
    const {show} = this.state

    return (
      <>
        {show ? (
          <div className="Wokoo">
            <header className="Wokoo-header">
              <span
                className="Wokoo-close-icon"
                onClick={this.handleClose}
              >X</span>
              {this.getContainer()}
            </header>
          </div>
        ) : (
          <div className="Wokoo-hide" onClick={this.handleClose}>
            <img src={logo} className="Wokoo-hide-logo" alt="logo"/>
            open
          </div>
        )}
      </>
    )

  }
}
