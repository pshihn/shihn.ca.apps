import { LitElement, customElement, html, TemplateResult, property, CSSResult, query } from 'lit-element';
import { flex } from 'soso/bin/styles/flex';
import { iconMap } from 'soso/bin/components/icon-map';

import 'soso/bin/components/icon';

const ICON_KEY = 'collapsible-panel';
iconMap.define({
  right: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  down: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'
}, ICON_KEY);

@customElement('collapsible-panel')
export class CollapsiblePanel extends LitElement {
  @property() label = '';
  @property() private collapsed = true;

  @query('#innerPanel') private innerPanel?: HTMLDivElement;
  @query('#outerPanel') private outerPanel?: HTMLDivElement;

  static get styles(): CSSResult {
    return flex;
  }

  render(): TemplateResult {
    return html`
    <style>
      :host {
        display: block;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 5px;
      }
      #outerPanel {
        position: relative;
        overflow: hidden;
        transition: height 0.3s ease;
      }
      #innerPanel {
        padding: var(--collapse-label-inner-padding, 8px 0 30px);
        box-sizing: border-box;
      }
      #header {
        color: #333;
        font-size: 15px;
        font-family: sans-serif;
        letter-spacing: 0.75px;
      }
      label {
        padding-left: 6px;
      }
    </style>
    <div id="header" class="horizontal layout center">
      <soso-icon @click="${this.toggleCollapse}" .iconkey="${ICON_KEY}" .icon="${this.collapsed ? 'right' : 'down'}"></soso-icon>
      <label @click="${this.toggleCollapse}">${this.label}</label>
    </div>
    <div id="outerPanel">
      <div id="innerPanel"><slot></slot></div>
    </div>
    `;
  }

  updated() {
    this.updateCollapsed();
  }

  private updateCollapsed() {
    if (this.innerPanel && this.outerPanel) {
      const innerHeight = this.innerPanel.offsetHeight;
      const outerStyle = this.outerPanel.style;
      if (this.collapsed) {
        outerStyle.height = `${innerHeight}px`;
        setTimeout(() => {
          if (this.collapsed) {
            outerStyle.height = '0px';
          }
        }, 5);
      } else {
        outerStyle.height = `${innerHeight}px`;
        setTimeout(() => {
          if (!this.collapsed) {
            outerStyle.height = 'auto';
          }
        }, 300);
      }
    }
  }

  private toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

}