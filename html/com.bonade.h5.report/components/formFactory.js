import utils from '../utils/publicUtils.js'
const TEXTAREA_HEIGHT = '30px'
const fn = {
    creater(id, formArray, doSave) {
        let formHtml = []
        _.each(formArray, (item) => {
            switch (item.componentName) {
                case 'TextField':
                case 'NumberField':
                case 'MoneyField':
                    let inputType = item.componentName === 'TextField' ? 'text' : 'number'
                    let subType = item.componentName === 'NumberField' ? 'int" pattern="[0-9]*"' : item.componentName === 'MoneyField' ? 'float' : ''
                    formHtml.push(this.htmlFactory(`<span class="mint-cell-text${item.props.required==='true'?' required':''}">${item.props.label}</span></div><div class="mint-cell-value"><input name="${item.props.id}" data-label="${item.props.label}" data-field-type="${item.componentName}" placeholder="${item.props.placeholder}" data-required="${item.props.required}" type="${inputType}" data-sub-type="${subType}" class="mint-field-core">`))
                    break
                case 'TextareaField':
                    formHtml.push(this.htmlFactory(`<span class="mint-cell-text${item.props.required==='true'?' required':''}">${item.props.label}</span></div><div class="mint-cell-value"><textarea name="${item.props.id}" data-label="${item.props.label}" data-field-type="${item.componentName}" placeholder="${item.props.placeholder}" data-required="${item.props.required}" class="mint-field-core"></textarea>`))
                    break
                case 'SelectField':
                case 'MultiSelectField':
                    let optionHtml = ''
                    let selectType = item.componentName === 'MultiSelectField' ? 'multiple' : ''
                    _.each(item.props.options, (option) => {
                        optionHtml = optionHtml + `<option value="${option}">${option}</option>`
                    })
                    formHtml.push(this.htmlFactory(`<span class="mint-cell-text${item.props.required==='true'?' required':''}">${item.props.label}</span></div><div class="mint-cell-value"><select ${selectType} name="${item.props.id}" data-label="${item.props.label}" data-field-type="${item.componentName}" data-required="${item.props.required}" class="mint-field-core">${optionHtml}</select><input placeholder="${item.props.placeholder}" type="text"readonly class="mint-field-core">`))
                    break
                case 'DateField':
                case 'DateRangeField':
                    //1:yyyy-MM-dd  0:yyyy-MM-dd HH:Mi
                    let className = ''
                    if (item.props.format !== 1) {
                        className = ' datetime'
                    }
                    let inputHtml = `<input type="date" name="${item.props.id}" data-label="${item.props.label}" data-field-type="${item.componentName}${className}" placeholder="${item.props.placeholder}" data-required="${item.props.required}" class="mint-field-core">`
                    inputHtml += item.props.format !== 1 ? '<input type="time" class="mint-field-core" placeholder="具体时间">' : ''
                    formHtml.push(this.htmlFactory(`<span class="mint-cell-text${item.props.required==='true'?' required':''}">${item.props.label}</span></div><div class="mint-cell-value${className}">${inputHtml}`))
                    if (item.componentName === 'DateRangeField') {
                        let innerHtml = `<span class="mint-cell-text${item.props.required==='true'?' required':''}">至</span></div><div class="mint-cell-value${className}"><input type="date" name="${item.props.id}" class="mint-field-core" placeholder="${item.props.placeholder}">`
                        innerHtml += item.props.format !== 1 ? '<input type="time" class="mint-field-core" placeholder="具体时间">' : ''
                        formHtml.push(this.htmlFactory(innerHtml, true))
                    }
                    break
                case 'TextNote':
                    formHtml.push(`<p class="block-title border-bottom">${item.props.label}</p>`)
                    break
            }
        })
        document.getElementById(id).innerHTML = formHtml.join('')
        this.friendlyInput(doSave)
    },
    htmlFactory(innerHtml, isDateRange) {
        return `<a class="mint-cell mint-field${isDateRange?' datetimeHalf':''}"><div class="mint-cell-wrapper"><div class="mint-cell-title">${innerHtml}<div class="mint-field-clear"><i class="mintui mintui-field-error"></i></div></div></div></a>`
    },
    //option
    getData(option) {
        let formData = []
        for (let i = 0; i < document.querySelectorAll('[data-field-type]').length; i++) {
            let item = document.querySelectorAll('[data-field-type]')[i]
            let currentValue = item.value
            let currentType = item.getAttribute('data-field-type').split(' ')[0]
            if (currentType === 'DateField') {
                let datetime = item.getAttribute('data-field-type').indexOf('datetime') !== -1
                if (datetime && item.value && item.nextElementSibling.value) {
                    currentValue += ' ' + item.nextElementSibling.value
                } else if (item.value) {
                    currentValue = item.value
                } else {
                    currentValue = ''
                }
            }
            if (currentType === 'DateRangeField') {
                let datetime = item.getAttribute('data-field-type').indexOf('datetime') !== -1
                let start, end
                let endInput = item.parentNode.parentNode.parentNode.nextElementSibling.querySelector('[type=date]')
                if (datetime && item.value && endInput.value && item.nextElementSibling.value && endInput.nextElementSibling.value) {
                    start = item.value + ' ' + item.nextElementSibling.value + ':00'
                    end = endInput.value + ' ' + endInput.nextElementSibling.value + ':00'
                    currentValue = start + '至' + end
                } else if (item.value && endInput.value) {
                    start = item.value
                    end = endInput.value
                    currentValue = start + '至' + end
                } else {
                    currentValue = ''
                }
            }
            if (currentType === 'MultiSelectField') {
                currentValue = item.nextElementSibling.value
            }
            let currentLabel = item.getAttribute('data-label')
            formData.push({
                id: item.getAttribute('name'),
                type: currentType,
                label: currentLabel,
                value: currentValue
            })
            if (item.getAttribute('data-required') === 'true' && currentValue === '' && option.validate) {
                toast('请填写' + currentLabel)
                return false
            }
        }
        let picList = []
        let imageList = document.querySelectorAll('.image-item span')
        for (let i = 0; i < imageList.length; i++) {
            picList.push({
                type: 'img',
                label: imageList[i].getAttribute('data-name'),
                value: imageList[i].getAttribute('data-url')
            })
        }
        formData = JSON.stringify(formData)
        picList = JSON.stringify(picList)
        let users = []
        let userList = document.querySelectorAll('.employee-item span')
        if (!option.isUpdate) {
            for (let i = 0; i < userList.length; i++) {
                users.push(userList[i].getAttribute('data-id'))
            }
            users = users.join(',')
            if (users === '' && option.validate) {
                toast('请选择发送给谁')
                return false
            }
            return { formData, users, picList }
        } else {
            return { formData, picList }
        }
    },
    resume(fieldsArray, valuesArray) {
        for (let i = 0; i < valuesArray.length; i++) {
            for (let j = 0; j < fieldsArray.length; j++) {
                if (valuesArray[i].fieldKey === fieldsArray[j].props.id) {
                    let currentValue = valuesArray[i].fieldValue
                    if (currentValue === '') {
                        break
                    }
                    let currentElement = document.querySelector('[name=\'' + valuesArray[i].fieldKey + '\']')
                    if (currentElement.tagName === 'SELECT') {
                        currentElement.nextElementSibling.value = currentValue
                        currentValue.split(',').map(function(val) {
                            for (let i = 0; i < currentElement.children.length; i++) {
                                if (currentElement.children[i].value === val) {
                                    currentElement.children[i].setAttribute('selected', 'selected')
                                }
                            }
                        })
                        currentElement.classList.add('filled')
                        currentElement.parentNode.classList.add('not-null')
                        currentElement.parentNode.parentNode.classList.add('jb')
                    } else if (currentElement.tagName === 'INPUT' && currentElement.type === 'date') {
                        let range = currentValue.split('至')
                        _.each(document.querySelectorAll('[name=\'' + currentElement.name + '\']'), function(item, index) {
                            if (!range[index]) {
                                return false
                            }
                            let datetime = range[index].split(' ')
                            if (datetime.length === 2) {
                                item.value = datetime[0]
                                item.nextElementSibling.value = datetime[1]
                                item.nextElementSibling.classList.add('filled')
                            } else {
                                item.value = range[index]
                            }
                            item.classList.add('filled')
                            item.parentNode.classList.add('not-null')
                            item.parentNode.parentNode.classList.add('jb')
                            item.parentNode.parentNode.parentNode.classList.add('hasDate')
                        })
                    } else {
                        currentElement.value = currentValue
                        if (currentElement.tagName === 'TEXTAREA') {
                            fn.setTextAreaHeight(currentElement)
                        }
                        currentElement.classList.add('filled')
                        currentElement.parentNode.classList.add('not-null')
                        currentElement.parentNode.parentNode.classList.add('jb')
                    }
                    break
                }
            }
        }
    },
    doSave: _.debounce(function() {
        let data = {
            formCode: location.href.substring(location.href.lastIndexOf('/') + 1),
            companyId: window.userInfo.companyId,
            empId: window.userInfo.empId,
            ...this.getData({})
        }
        document.querySelector('.loading').style.display = 'block'
        document.querySelector('.last-update-time p').style.display = 'none'
        utils.ajax({
            loading: false,
            url: '/report/reportdatacached/app/v1/updateCachedReportData',
            data,
            success: (res) => {
                document.querySelector('.last-update-time').style.display = 'block'
                document.querySelector('.last-update-time').classList.add('visible')
                document.querySelector('.loading').style.display = 'none'
                document.querySelector('.last-update-time p').style.display = 'block'
                document.querySelector('.last-update-time .time').innerHTML = new Date(res.timestamp * 1).format('yyyy-MM-dd hh:mm:ss')
            },
            error: () => {
                document.querySelector('.loading').style.display = 'none'
                document.querySelector('.last-update-time p').style.display = 'block'
            }
        })
    }, 500, false),
    setTextAreaHeight(textarea) {
        textarea.style.height = TEXTAREA_HEIGHT
        textarea.parentNode.parentNode.style.height = '54px'
        if (textarea.scrollHeight < 54 || textarea.value === '') {
            return false
        }
        textarea.style.height = 'auto'
        textarea.style.overflow = 'hidden'
        textarea.style.height = textarea.scrollHeight + 'px'
        textarea.parentNode.parentNode.style.height = textarea.scrollHeight + 64 + 'px'
    },
    moneyInputFilter(val) {
        val = val.replace(/[^\d.]/g, '')
        val = val.replace(/\.{2,}/g, '.')
        val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        if (val.indexOf('.') < 0 && val !== '') {
            val = parseFloat(val)
        }
        return val
    },
    friendlyInput(doSave) {
        _.each(document.querySelectorAll('.mint-field-clear'), function(item) {
            item.onclick = function() {
                _.each(this.parentNode.querySelectorAll('input,select,textarea'), function(field) {
                    field.value = ''
                    field.classList.remove('filled')
                    field.parentNode.classList.remove('not-null')
                    field.parentNode.parentNode.classList.remove('jb')
                    field.parentNode.parentNode.removeAttribute('style')
                    field.parentNode.parentNode.parentNode.classList.remove('hasDate')
                    if (field.tagName === 'TEXTAREA') {
                        field.style.height = TEXTAREA_HEIGHT
                    }
                    if (doSave) {
                        fn.doSave()
                    }
                })
            }
        })
        _.each(document.querySelectorAll('input,textarea,select'), function(item) {
            item.onfocus = function() {
                item.parentNode.classList.add('focus')
                item.parentNode.parentNode.classList.add('jbb')
                item.click()
            }
            item.onblur = function() {
                if (item.getAttribute('data-sub-type') === 'float') {
                    this.value = fn.moneyInputFilter(this.value)
                }
                if (!(item.tagName === 'SELECT' || (item.tagName === 'INPUT' && (item.type === 'date' || item.type === 'time')))) {
                    if (doSave) {
                        fn.doSave()
                    }
                }
                setTimeout(() => {
                    item.parentNode.classList.remove('focus')
                    item.parentNode.parentNode.classList.remove('jbb')
                }, 200)
            }
            if (item.tagName === 'INPUT' && (item.type === 'date' || item.type === 'time')) {
                item.onchange = function() {
                    if (doSave) {
                        fn.doSave()
                    }
                    if (this.value !== '') {
                        this.parentNode.classList.add('not-null')
                        this.parentNode.parentNode.classList.add('jb')
                        this.parentNode.parentNode.parentNode.classList.add('hasDate')
                        this.classList.add('filled')
                    } else {
                        this.classList.remove('filled')
                        this.parentNode.classList.remove('not-null')
                        this.parentNode.parentNode.classList.remove('jb')
                        this.parentNode.parentNode.parentNode.classList.remove('hasDate')
                    }
                }
            } else if (item.tagName === 'INPUT' && item.type === 'number') {
                item.onkeyup = function() {
                    if (item.getAttribute('data-sub-type') === 'float') {
                        this.value = fn.moneyInputFilter(this.value)
                    }
                    if (this.value !== '') {
                        this.classList.add('filled')
                        this.parentNode.classList.add('not-null')
                        this.parentNode.parentNode.classList.add('jb')
                    } else {
                        this.classList.remove('filled')
                        this.parentNode.classList.remove('not-null')
                        this.parentNode.parentNode.classList.remove('jb')
                    }
                }
            } else if (item.tagName === 'SELECT') {
                item.onchange = function() {
                    if (doSave) {
                        fn.doSave()
                    }
                    let value = []
                    _.each(this.options, function(option) {
                        if (option.selected) {
                            value.push(option.value)
                        }
                    })
                    this.nextElementSibling.value = value
                    if (value !== '') {
                        this.classList.add('filled')
                        this.parentNode.classList.add('not-null')
                        this.parentNode.parentNode.classList.add('jb')
                    } else {
                        this.classList.remove('filled')
                        this.parentNode.classList.remove('not-null')
                        this.parentNode.parentNode.classList.remove('jb')
                    }
                }
            } else if (item.tagName === 'TEXTAREA') {
                item.onkeyup = function() {
                    fn.setTextAreaHeight(this)
                    if (this.value !== '') {
                        this.classList.add('filled')
                        this.parentNode.classList.add('not-null')
                        this.parentNode.parentNode.classList.add('jb')
                    } else {
                        this.classList.remove('filled')
                        this.parentNode.classList.remove('not-null')
                        this.parentNode.parentNode.classList.remove('jb')
                    }
                }
                item.onchange = function() {
                    setTimeout(() => {
                        fn.setTextAreaHeight(this)
                    }, 250)
                }
            } else {
                item.onkeyup = function() {
                    if (this.value !== '') {
                        this.classList.add('filled')
                        this.parentNode.classList.add('not-null')
                        this.parentNode.parentNode.classList.add('jb')
                    } else {
                        this.classList.remove('filled')
                        this.parentNode.classList.remove('not-null')
                        this.parentNode.parentNode.classList.remove('jb')
                    }
                }
            }
        })
    }
}
export default fn