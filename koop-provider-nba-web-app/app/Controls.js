define([
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',

  'app/PlayersData',

  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom',
  'dojo/Evented',
  'dojo/on',
  'dojo/dom-construct',
], function(
  _WidgetBase, _TemplatedMixin,
  PlayersData,
  declare,
  lang, dom, Evented, on, domConstruct
) {
  return declare([_WidgetBase, _TemplatedMixin, Evented], {
    templateString: '<div class="controls"></div>',

    
    // Widget LifeCycle
    postCreate: function() {
      this.inherited(arguments);
      console.log('CONTROLS POST CREATE');
      this.playersObject = new PlayersData();

      this.createPlayerSelect();
      this.createYearsSelect();
    },
    
    createPlayerSelect: function() {
      var selectOptions = this.playersObject.data.data.players.map(function(playersObject) {
        return {
          value: playersObject[0],
          label: playersObject[1],
          minYear: playersObject[3],
          maxYear: playersObject[4],
        }
      });

      this.playerSelect = domConstruct.create('select', {
        change: function(evt) {
          var value = evt.target.options[evt.target.selectedIndex].value;
          console.log('ONCHANGE', value);
          this.updateYearsSelectOptions(this.getPlayerSelectMinYear(), this.getPlayerSelectMaxYear());

          this.emit('change', {playerId:this.getPlayerSelectValue(), year:this.getYearSelectValue()});
        }.bind(this)
      });
      selectOptions.forEach(function(selectionOptionObject) {
        var option = domConstruct.create('option', {
          innerHTML: selectionOptionObject.label,
          value: selectionOptionObject.value,
          'data-min-year': selectionOptionObject.minYear,
          'data-max-year': selectionOptionObject.maxYear,
        });
        this.playerSelect.appendChild(option);
      }.bind(this));
      domConstruct.place(this.playerSelect, this.domNode, 'last');
    },

    getPlayerSelectValue: function() {
      var selectedOption = this.playerSelect.options[this.playerSelect.selectedIndex];
      console.log('minYear', selectedOption.getAttribute('data-min-year'));
      console.log('maxYear', selectedOption.getAttribute('data-max-year'));
      return selectedOption.value;
    },

    getPlayerSelectMinYear: function() {
      var selectedOption = this.playerSelect.options[this.playerSelect.selectedIndex];
      return selectedOption.getAttribute('data-min-year');
    },

    getPlayerSelectMaxYear: function() {
      var selectedOption = this.playerSelect.options[this.playerSelect.selectedIndex];
      return selectedOption.getAttribute('data-max-year');
    },
    
    createYearsSelect: function() {
      this.yearSelect = domConstruct.create('select', {
        change: function(evt) {
          var value = evt.target.options[evt.target.selectedIndex].value;
          console.log('ONCHANGE', value);
          this.emit('change', {playerId:this.getPlayerSelectValue(), year:this.getYearSelectValue()});
        }.bind(this)
      });
      
      domConstruct.place(this.yearSelect, this.domNode, 'last');
    },

    updateYearsSelectOptions: function(minYear, maxYear) {
      console.log('updateYearsSelectOptions', minYear, maxYear);
      // remove all options (ew - fix this code)
      var i;
      for(i = this.yearSelect.options.length - 1 ; i >= 0 ; i--)
      {
        this.yearSelect.remove(i);
      }

      for(i = maxYear; i > minYear; i--) {
        var option = domConstruct.create('option', {
          innerHTML: i,
          value: i
        });
        this.yearSelect.appendChild(option);
      }
    },

    getYearSelectValue: function() {
      return this.yearSelect.options[this.yearSelect.selectedIndex].value;
    }
  });
});