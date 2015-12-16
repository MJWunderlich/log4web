/**
 * Created by mjwunderlich on 12/15/15.
 */

Log4JS.load({

  'public': {
    level: 'info',
    muted: false,
    adapters: [
      new Log4JSHtmlAdapter({target: '#logs1', template: '#template', messageEl: 'em'})
    ]
  },

  'public.frontend' : {
    level: 'warn',
    muted: false,
    adapters: [
      new Log4JSConsoleAdapter()
    ],
  }

});
