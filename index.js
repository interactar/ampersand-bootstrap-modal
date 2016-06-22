/**
 *
 * @author Facugon <facugon@interactar.com>
 * @version 0.0.1
 *
 * Ampersand View component for rendering Bootstrap Modals
 *
 */
var View = require('ampersand-view');
window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');
var template_hbs = require('./template.hbs');
var buttons_hbs = require('./buttons.hbs');

var ButtonsView = View.extend({
  template:buttons_hbs,
  props:{
    'confirmButton':{
      'type':'string',
      'default':'CONFIRM'
    }
  },
  bindings:{
    'confirmButton':{
      'hook':'confirm',
      'type':'text'
    }
  }
});

module.exports = View.extend({
  initialize:function(options){
    options=options||{};

    var hiddenFn = this.onHiddenModal;
    this.onHiddenModal = options.onHidden || hiddenFn;

    var showFn = this.onShowModal;
    this.onShowModal = options.onShow || showFn;

    View.prototype.initialize.apply(this, arguments);
  },
  template: template_hbs,
  autoRender:true,
  props:{
    'buttons':['boolean',false,false],
    'class':'string',
    'bodyView':'object',
    'title':{
      'type':'string',
      'default':'MODAL TITLE',
    },
    'confirmButton':{
      'type':'string',
      'default':'CONFIRM'
    }
  },
  bindings:{
    'class':{
      'hook':'modalizer-class',
      'type':'attribute',
      'name':'class'
    },
    'title':{
      'hook':'title',
      'type':'text'
    },
    'buttons':{
      hook:'buttons',
      type:'toggle'
    }
  },
  render:function(){
    this.renderWithTemplate(this);
    document.body.appendChild(this.el);
    $modal = $(this.query('.modal'));
    this.$modal = $modal;

    this.queryByHook('body')
      .appendChild(this.bodyView.el);

    if(this.buttons){
      this.renderSubview(
        new ButtonsView({
          'confirmButton': this.confirmButton,
        }),
        this.queryByHook('buttons-container')
      )
    }
  },
  show:function(){
    var $modal = this.$modal;
    $modal.on('hidden.bs.modal',this.onHiddenModal);
    $modal.on('show.bs.modal',this.onShowModal);
    $modal.modal('show');
  },
  hide:function(){
    var $modal = this.$modal;
    $modal.modal('hide');
    $modal.off('hidden.bs.modal',this.onHiddenModal);
    $modal.off('show.bs.modal',this.onShowModal);
  },
  onHiddenModal:function(ev){
  },
  onShowModal:function(ev){
  },
  remove:function(){
    var $modal = this.$modal;
    this.hide();
    this.bodyView.remove();
    View.prototype.remove.apply(this, arguments);
  }
});
