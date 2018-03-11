var lineItem = function(id, name, amount) {
    var self = this;

    self.id = id
    self.name =ko.observable(name);
    self.amount = ko.observable(amount);
    self.actual = ko.observable(false);

    self.markAsActual = function(){
        self.actual(true);
    }

    self.formattedName = ko.computed(function(){
        return `<strong>${self.name()}</stong>`;
    })

    self.formattedAmount = ko.computed(function() {
        return `£${self.amount()}`;
    });

    self.buttonCss = ko.computed(function() {
        return self.actual() ? 'paid' : 'notPaid';
    });

    self.buttonText = ko.computed(function() {
        return self.actual() ? 'Paid' : 'Mark as Paid';
    });

    return self;
}

var app = function(currentBalance) {
    var self = this;

    self.nextId = 13;

    // functions and helpers
    self.populateOutgoings = function() {
        var list = [];

        list.push(new lineItem(1, 'Rent', 500));
        list.push(new lineItem(2, 'Electric', 500));
        list.push(new lineItem(3, 'Car', 500));
        list.push(new lineItem(4, 'Clothes',  500));
        list.push(new lineItem(5, 'Car', 500));
        list.push(new lineItem(6, 'Clothes',  500));

        list.push(new lineItem(7, 'Gas', 500));
        list.push(new lineItem(8, 'Shopping', 500));
        list.push(new lineItem(9, 'Food', 500));
        list.push(new lineItem(10, 'Gym',  500));
        list.push(new lineItem(11, 'Food', 500));
        list.push(new lineItem(12, 'Gym',  500));

        return list;
    }

    self.populateIncomings = function() {
        var list = [];

        list.push(new lineItem(1, 'Wages', 1200));
        list.push(new lineItem(2, 'Child Benefit', 500));

        return list;
    }

    self.findOutgoing = function(targetId) {
        for(var ogId = 0; ogId < self.outgoings().length; ogId++) {
            if (self.outgoings()[ogId].id == targetId){
                return self.outgoings()[ogId];
            }
        }

        throw console.error("Couldn't find outgoing with id: " + targetId);
    }

    self.markIncomingAsActual = function(targetId) {
        for(var ogId = 0; ogId < self.incomings().length; ogId++) {
            var outgoing = self.incomings()[ogId];
            if (outgoing.id == targetId && !outgoing.actual()) {
                outgoing.actual(true);
                break;
            }
        }
    }

    self.markOutgoingAsActual = function(targetId) {
        for(var ogId = 0; ogId < self.outgoings().length; ogId++) {
            var outgoing = self.outgoings()[ogId];
            if (outgoing.id == targetId && !outgoing.actual()) {
                outgoing.actual(true);
                break;
            }
        }
    }

    self.removeOutgoing = function(targetId) {
        var targetIndex = -1;
        for(var ogId = 0; ogId < self.outgoings().length; ogId++) {
            if (self.outgoings()[ogId].id == targetId){
                targetIndex = ogId;
                break;
            }
        }

        if (targetIndex > -1) {
            self.outgoings.splice(targetIndex, 1);
            return;
        }

        throw console.error("unable to find outgoing with id of: "+ targetId);
    }

    self.addIncoming = function() {
        var name = $('#incomingName').val();
        var amount = Number($('#incomingAmount').val());
        if (Number.isNaN(amount)) {
            throw console.error('Amount is not a number');
        }

        self.incomings.push(new lineItem(self.nextId, name, amount));

        self.nextId+=1;
        $('#incomingName').val('');
        $('#incomingAmount').val('');
    }

    self.addOutgoing = function() {
        var name = $('#outgoingName').val();
        var amount = Number($('#outgoingAmount').val());
        if (Number.isNaN(amount)) {
            throw console.error('Amount is not a number');
        }

        self.outgoings.push(new lineItem(self.nextId, name, amount));

        self.nextId+=1;
        $('#outgoingName').val('');
        $('#outgoingAmount').val('');
    }
    
    // properties
    self.currentBalance = ko.observable(currentBalance);
    self.outgoings = ko.observableArray(self.populateOutgoings());
    self.incomings = ko.observableArray(self.populateIncomings());

    // members
    self.outgoingForecasts = ko.computed(function(){
        var list = [];

        for(var index = 0; index < self.outgoings().length; index++) {
            var item = self.outgoings()[index];
            if (!item.actual()) {
                list.push(item);
            }
        }

        return list;
    });

    self.incomingForecasts = ko.computed(function(){
        var list = [];

        for(var index = 0; index < self.incomings().length; index++) {
            var item = self.incomings()[index];
            if (!item.actual()) {
                list.push(item);
            }
        }

        return list;
    });

    self.outgoingActual = ko.computed(function(){
        var list = [];

        for(var index = 0; index < self.outgoings().length; index++) {
            var item = self.outgoings()[index];
            if (item.actual()) {
                list.push(item);
            }
        }

        return list;
    });

    self.incomingActual = ko.computed(function(){
        var list = [];

        for(var index = 0; index < self.incomings().length; index++) {
            var item = self.incomings()[index];
            if (item.actual()) {
                list.push(item);
            }
        }

        return list;
    });

    self.incomingForecastValue = ko.computed(function() {
        var value = 0;
        for(var ogId = 0; ogId < self.incomings().length; ogId++) {
            value += self.incomings()[ogId].amount();
        }
        return value;
    });

    self.outgoingForecastValue = ko.computed(function() {
        var value = 0;
        for(var ogId = 0; ogId < self.outgoings().length; ogId++) {
            value += self.outgoings()[ogId].amount();
        }
        return value;
    });
    
    self.incomingActualValue = ko.computed(function() {
        var value = 0;
        for(var ogId = 0; ogId < self.incomingActual().length; ogId++) {
            value += self.incomingActual()[ogId].amount();
        }
        return value;
    });

    self.outgoingActualValue = ko.computed(function(){
        var value = 0;
        for(var ogId = 0; ogId < self.outgoingActual().length; ogId++) {
            value += self.outgoingActual()[ogId].amount();
        }
        return value;
    });

    self.formattedActualBalance = ko.pureComputed(function() {
        var value = (Number(self.currentBalance()) + Number(self.incomingActualValue())) - Number(self.outgoingActualValue());
        return `${(value < 0) ? "-" : ""}£${Math.abs(value)}`;
    });

    self.formattedForecastValue = ko.pureComputed(function() {
        debugger;
        var value = (Number(self.currentBalance()) + Number(self.incomingForecastValue())) - Number(self.outgoingForecastValue());
        return `${(value < 0) ? "-" : ""}£${Math.abs(value)}`;
    });

    return self;
}