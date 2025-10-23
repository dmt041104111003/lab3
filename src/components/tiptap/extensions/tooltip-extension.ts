import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tooltip: {
      setTooltip: (attributes: { tooltip: string }) => ReturnType;
      unsetTooltip: () => ReturnType;
    };
  }
}

export const Tooltip = Mark.create({
  name: 'tooltip',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'tooltip-trigger cursor-pointer bg-blue-100/80 text-blue-900 px-2 py-1 rounded-md border-2 border-blue-300/60 hover:bg-blue-200/90 transition-all duration-200 font-medium',
      },
    };
  },

  addAttributes() {
    return {
      tooltip: {
        default: null,
        parseHTML: element => element.getAttribute('data-tooltip'),
        renderHTML: attributes => {
          if (!attributes.tooltip) {
            return {};
          }
          return {
            'data-tooltip': attributes.tooltip,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-tooltip]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setTooltip:
        attributes =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      unsetTooltip:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          onClick: {
            default: null,
            parseHTML: () => null,
            renderHTML: () => null,
          },
        },
      },
    ];
  },
}); 