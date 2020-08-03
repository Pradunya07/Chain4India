/**
 * Copyright 2017 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ----------------------------------------------------------------------------
 */
'use strict'

const m = require('mithril')
const _ = require('lodash')

const layout = require('./layout')

/**
 * Returns a labeled form group
 */
const group = (label, ...contents) => {
  return m('.form-group', [
    m('label', label),
    contents
  ])
}
/*
 <form action="/action_page.php">
  <input type="checkbox" name="vehicle1" value="Bike">
  <label for="vehicle1"> I have a bike</label><br>
  <input type="checkbox" name="vehicle2" value="Car">
  <label for="vehicle2"> I have a car</label><br>
  <input type="checkbox" name="vehicle3" value="Boat" checked>
  <label for="vehicle3"> I have a boat</label><br><br>
  <input type="submit" value="Submit">
</form> 

const groupStatus= (label, ...contents) => {
  return m('.form-group', [
    m('input.input[type=checkbox][value=1]'),
    m("label.label", "Certified"),
    m("input.input[type=checkbox][value=2]"),
    m("label.label", "Uncertified"),

    contents
  ])
}
*/
/**
 * Returns a bare input field suitable for use in a form group.
 * Passes its value to a callback, and defaults to required.
 */
const field = (onValue, attrs = null) => {
  const defaults = {
    required: true,
    oninput: m.withAttr('value', onValue)
  }

  return m('input.form-control.mb-1', _.assign(defaults, attrs))
}


const field_status = (onValue, attrs = null) => {
  const defaults = {
    required: true,
    onclick: m.withAttr('value', onValue)
  }

  //let handleChange = vnode.attrs.onchange || (() => null)

  return m('.form-group', [
    m("input.input[type=checkbox]",{
                value: 1}),
    m("label.label", "Certified"),
    m("input.input[type=checkbox]",{
                value: 2}),
    m("label.label", "Uncertified"),
  ])


}

/*
<label for="cars">Choose a car:</label>

<select name="cars" id="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="mercedes">Mercedes</option>
  <option value="audi">Audi</option>
</select>
*/






/**
 * Returns a labeled input field which passes its value to a callback

const input = (type, onValue, label, required = true) => {
  return group(label, field(onValue, { type, required }))
}


const sp_inputone= (type,1, label, required = true) => {
  return group(label, field(onValue, { type, required }))
} */
/*
const sp_inputtwo= (type,2, label, required = true) => {
  return group(label, field(onValue, { type, required }))
}


*/
//const textInputOne = _.partial(sp_inputone, 'text')
//const textInputTwo = _.partial(sp_inputtwo, 'text')

const textInput = _.partial(input, 'text')
const passwordInput = _.partial(input, 'password')
const numberInput = _.partial(input, 'number')
const emailInput = _.partial(input, 'email')


//--------------------
const field_status_dropdown = (onValue, attrs = null) => {
  return m("form",
  m("select", 
      m("option", onValue(1),
        "Certified"
      )
  )
)
//, _.assign(defaults, attrs)
}



/**
 * Creates an icon with an onclick function
 */
const clickIcon = (name, onclick) => {
  return m('span.mx-3', { onclick }, layout.icon(name))
}

/**
 * Convenience function for returning partial onValue functions
 */
const stateSetter = state => key => value => { state[key] = value }

/**
 * Event listener which will set HTML5 validation on the triggered element
 */
const validator = (predicate, message, id = null) => e => {
  const element = id === null ? e.target : document.getElementById(id)

  if (predicate(element.value)) {
    element.setCustomValidity('')
  } else {
    element.setCustomValidity(message)
  }
}

/**
 * Triggers a download of a dynamically created text file
 */
const triggerDownload = (name, ...contents) => {
  const file = new window.Blob(contents, {type: 'text/plain'})
  const href = window.URL.createObjectURL(file)
  const container = document.getElementById('download-container')
  m.render(container, m('a#downloader', { href, download: name }))
  document.getElementById('downloader').click()
  m.mount(container, null)
}

/**
 * A MultiSelect component.
 *
 * Given a set of options, and currently selected values, allows the user to
 * select all, deselect all, or select multiple.
 */
const MultiSelect = {
  view (vnode) {
    let handleChange = vnode.attrs.onchange || (() => null)
    let selected = vnode.attrs.selected
    let color = vnode.attrs.color || 'light'
    return [
      m('.dropdown',
        m(`button.btn.btn-${color}.btn-block.dropdown-toggle.text-left`,
          {
            'data-toggle': 'dropdown',
          }, vnode.attrs.label),
        m('.dropdown-menu.w-100',
          m("a.dropdown-item[href='#']", {
            onclick: (e) => {
              e.preventDefault()
              handleChange(vnode.attrs.options.map(([value, label]) => value))
            }
          }, 'Select All'),
          m("a.dropdown-item[href='#']", {
            onclick: (e) => {
              e.preventDefault()
              handleChange([])
            }
          }, 'Deselect All'),
          m('.dropdown-divider'),
          vnode.attrs.options.map(
            ([value, label]) =>
             m("a.dropdown-item[href='#']", {
               onclick: (e) => {
                 e.preventDefault()

                 let setLocation = selected.indexOf(value)
                 if (setLocation >= 0) {
                   selected.splice(setLocation, 1)
                 } else {
                   selected.push(value)
                 }

                 handleChange(selected)
               }
             }, label, (selected.indexOf(value) > -1 ? ' \u2714' : '')))))
    ]
  }
}

module.exports = {
  group,
  field,
  field_status,
  field_status_dropdown,
  input,
  //textInputOne,
  //textInputTwo,
  textInput,
  passwordInput,
  numberInput,
  emailInput,
  clickIcon,
  stateSetter,
  validator,
  triggerDownload,
  MultiSelect
}
