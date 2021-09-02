// ==UserScript==
// @name        字段列表-配置
// @namespace   Violentmonkey Scripts
// @match       http://114.215.144.114:9001/saas-tms*
// @match       http://localhost:8090/*
// @match       http://39.104.75.20:56000/*
// @grant       none
// @run-at      document-end
// @version     1.0
// @icon        https://user-gold-cdn.xitu.io/2019/5/24/16ae85dca9dad910?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1
// @author      Ives
// @description 2021/9/2 上午9:36:27
// ==/UserScript==

;(function () {
  'use strict'

  if (location.href === 'http://localhost:8080/') return

  const iframe = document.querySelector('iframe')

  const script = document.createElement('script')
  script.src = 'http://localhost:8080/app.bundle.js'

  if (iframe) {
    iframe.contentWindow.document.body.appendChild(script)
  } else {
    document.body.appendChild(script)
  }

})()
