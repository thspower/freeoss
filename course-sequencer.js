// Usage Notes

// 1. Require this exact class early in the document, potentially in the <head> element.
// <script src="https://raw.githubusercontent.com/thspower/freeoss/refs/heads/main/course-sequencer.js" />

// 2. Define the sequence which it renders above the web component.
/*<template id="custom-course">
  <script id="course" type="application/json">
    // Replace contents of this array, and remove this comment.
    [{
      "title": "This is Sequence Frame 1",
      "content": "<h1>This is content #1"
    }, {
      "title": "This is Sequence Frame 2",
      "content": "<h1>This is content #2"
    }]
  </script>
</template>*/

// 3. Place the webcomponenet on the page.
// <cours-e></cours-e>

// **Great Tip**
// To access the rendered elements, i.e. the <cours-e> shadow DOM,
// `document.querySelector('cours-e').shadowRoot` contains the document root of the webcomponent

class CourseSequencer extends HTMLElement {
  constructor() {
    super();
    this.state = {
      topicShowing: 0
    }
    this.attachShadow({ mode: "open" });
    const script = document.getElementById('custom-course').content.querySelector('script');
    const course = JSON.parse(script.innerHTML);

    const courseHTML = this.courseTemplate(course);
    const div = document.createElement('div');
    div.innerHTML = courseHTML;
    this.shadowRoot.appendChild(div);
    this.courseStyles();

    this.updateState = this.updateState.bind(this);
    this.changeTopic = this.changeTopic.bind(this);
    this.toggleIndex = this.toggleIndex.bind(this);
    this.getIndex = this.getIndex.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelectorAll('.ioc').forEach((button) => {
      button.addEventListener('click', this.changeTopic);
    });
    this.shadowRoot.querySelectorAll('button.pager').forEach((button) => {
      button.addEventListener('click', this.changeTopic);
    });

    this.shadowRoot.getElementById('index-activator').addEventListener(('click'), this.toggleIndex)
  }

  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue !== newValue) return;
    this[property] = newValue;
  }

  changeTopic(event) {
    let index = this.getIndex(event);
    const shadowDocument = this.shadowRoot;

    const previousContent = shadowDocument.querySelector('.topic-content.showing');
    previousContent.classList.remove('showing');
    const previousIndex = shadowDocument.querySelector('.ioc.showing');
    previousIndex.classList.remove('showing');

    const contentToShow = shadowDocument.querySelector(`.topic-content[data-index="${index}"]`);
    contentToShow.classList.add('showing');
    const indexToShow = shadowDocument.querySelector(`.ioc[data-index="${index}"]`);
    indexToShow.classList.add('showing');

    if (index !== this.state.topicShowing) {
      this.updateState({ topicShowing: index });
      shadowDocument.getElementById('main-content').scrollTop = 0;
    }
  }

  getIndex(event) {
    const { topicShowing } = this.state;
    let index;
    if (event.target.dataset.index) {
      index = Number(event.target.dataset.index);
    } else {
      const direction = event.target.dataset.direction;
      index = direction === 'next' ? topicShowing + 1 : topicShowing - 1;
    }
    
    const numberTopics = this.shadowRoot.querySelectorAll('.ioc').length;

    if (index < 0) index = 0;
    if (index === numberTopics) index = numberTopics - 1;
    return index;
  }

  toggleIndex(event) {
    const index = this.shadowRoot.querySelector('#index');
    const showing = index.classList.contains('showing');
    const toggle = showing ? 'remove' : 'add';
    index.classList[toggle]('showing');
  }

  updateState(state) {
    this.state = { ...this.state, ...state };
  }

  courseTemplate(data) {
    return `
    <div id="course-frame">
      <div id="course">
        <div id="index" class="">
          ${data.map((topic, index) => {
            return `<button class="ioc ${index === this.state.topicShowing ? 'showing' : ''}" data-topic-id="topic-${index}" data-index="${index}">${topic.title}</button>`
          }).join('')}
        </div>
        <div id="main-content">
          ${data.map((topic, index) => {
            return `
              <div class="topic-content ${index === this.state.topicShowing ? 'showing' : ''}" id="topic-${index}-content" data-index="${index}">
                <p><b>${topic.title}</b></p>
                <hr>
                ${topic.content}
              </div>
            `;
          }).join('')}
        </div>
        <div id="controls">
          <button id="index-activator" class="indicator">
            <div class="hotnspicy">
            <div class="icon"></div>
            <div class="icon"></div>
            <div class="icon"></div>
            </div>
          </button>
          <button id="previous" class="indicator pager" data-direction="previous"><span class="arrow">&larr;</span></button>
          <button id="next" class="indicator pager" data-direction="next"><span class="arrow">&rarr;</span></button>
        </div>
      </div>
    </div>
    `;
  }

  courseStyles() {
    const style = document.createElement('style');
    const styles = {
      courseFrame: {
        height: '550px',
        width: '600px',
        border: '1px solid darkgray'
      },
      index: {
        background: 'rgb(255,255,255)',
        textColor: 'initial',
        fontWeight: 'normal',
        topicBackground: 'rgb(255,255,255)',
        showingTopicBackground: '#f7f7f7',
        hoverBackground: '#f7f7f7',
        hoverTextColor: 'initial',
        activeBackground: 'darkgray',
        activeTextColor: 'white',
        width: '40%',
        border: '1px solid darkgray'
      },
      content: {
        background: 'rgb(255,255,255)'
      },
      controls: {
        height: '3rem',
        border: '1px solid darkgray',
        background: 'rgb(255,255,255)',
        textColor: 'darkgray',
        hoverBackground: '#f7f7f7',
        hoverTextColor: 'darkgray',
        activeBackground: 'darkgray',
        activeTextColor: 'rgb(255,255,255)',
        arrowSize: 2
      }
    }
    style.innerHTML = `
      * { box-sizing: border-box; }
      #course-frame {
        display: flex;
        overflow-y: hidden;
        height: ${styles.courseFrame.height};
        width: ${styles.courseFrame.width};
        max-width: 100%;
        border: ${styles.courseFrame.border};
      }

      #course {
        background: ${styles.content.background};
        display: flex;
        position: relative;
        padding-bottom: ${styles.controls.height};
        overflow-y: hidden;
      }

      #course #index {
        width: 0rem;
        transition: width .1s;
        position: absolute;
        background: ${styles.index.background};
        height: 100%;
        color: ${styles.index.textColor}
      }

      #course #index.showing {
        width: ${styles.index.width};
        border-right: ${styles.index.border};
      }

      #course #index .ioc {
        padding: 1rem;
        border-bottom: 1px solid gray;
        cursor: pointer;
        font-weight: ${styles.index.fontWeight};
        background: ${styles.index.topicBackground};
      }

      #course #index .ioc.showing {
        background: ${styles.index.showingTopicBackground};
      }

      #course #index .ioc:hover {
        background: ${styles.index.hoverBackground};
        color: ${styles.index.hoverTextColor};
      }

      #course #index .ioc:active {
        background-color: ${styles.index.activeBackground};
        color: ${styles.index.activeTextColor};
      }

      #course #main-content {
        padding: 1rem;
      }

      #course #main-content,
      #course #index {
        overflow-y: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      #course #main-content::-webkit-scrollbar,
      #course #index::-webkit-scrollbar {
        display: none;
      }

      #controls {
        position: absolute;
        width: 100%;
        bottom: 0;
        display: flex;
        border-top: ${styles.controls.border};
        height: ${styles.controls.height};
      }

      #controls .indicator {
        padding: 1rem;
        cursor: pointer;
        justify-content: center;
        background: ${styles.controls.background};
        color: ${styles.controls.textColor}
      }

      #controls .indicator:not(:last-of-type) {
        border-right: ${styles.controls.border};
      }

      #controls .indicator .arrow {
        transform: scale(${styles.controls.arrowSize});
      }

      #controls .indicator:hover {
        background: ${styles.controls.hoverBackground};
      }

      #controls .indicator:active {
        background: ${styles.controls.activeBackground};
        color: ${styles.controls.activeTextColor};
      }

      #controls #index-activator {
        width: 15%;
      }

      .hotnspicy {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }

      .hotnspicy .icon {
        height: 3px;
        width: 17px;
        background-color: ${styles.controls.textColor};
      }

      .indicator:hover .hotnspicy {
        background: ${styles.controls.hoverBackground};
      }

      .indicator:hover .hotnspicy .icon {
        background: ${styles.controls.hoverTextColor};
      }

      .indicator:active .hotnspicy {
        background: ${styles.controls.activeBackground};
      }

      .indicator:active .hotnspicy .icon {
        background: ${styles.controls.activeTextColor};
      }

      #controls #previous, #controls #next {
        flex-grow: 1;
      }

      .topic-content {
        display: none;
      }

      .topic-content.showing {
        display: block;
      }

      button {
        background-color: transparent;
        border-width: 0;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
        padding: 0;
        display: flex;
        width: 100%
      }
    `;
    this.shadowRoot.appendChild(style);
  }
}
customElements.define('cours-e', CourseSequencer);
