/**
 * Created by mjwunderlich on 12/15/15.
 */

Log4JS.load({

  'public': {
    level: 'info',
    muted: false,
    attachToErrorHandler: true,
    adapters: [
      new Log4JSHtmlAdapter({
        target: '#logs1',
        template: '#template',
        messageEl: 'em'},
        new Log4JSLayout('{message} -- {type}')
      ),
      new Log4JSConsoleAdapter(new Log4JSLayout('{type}: {message}')),
      new Log4JSAjaxAdapter('log', 'post', false, 'message')
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
