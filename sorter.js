// Контроллер
var ItemsController = function ItemsController(view, sorter) {
  this.view  = view;
  this.sorter = sorter;
};

// Получение данных. В данном случае просто добавление тестового списка
ItemsController.prototype.getItems = function getItems() {
  this.items = [
    {
      number: 12,
      date: '2016-07-02',
      name: 'Иванов Александр',
      sum: 600.12
    },
    {
      number: 7,
      date: '2017-09-13',
      name: 'Семенов Николай',
      sum: 7200.60
    },
    {
      number: 5,
      date: '2015-05-20',
      name: 'Антонов Алексей',
      sum: 1248.16
    },
    {
      number: 18,
      date: '2016-12-24',
      name: 'Алексеев Игорь',
      sum: 20.65
    },
    {
      number: 3,
      date: '2015-08-17',
      name: 'Потапов Серей',
      sum: 12720.00
    },
    {
      number: 1,
      date: '2015-01-20',
      name: 'Николаев Иван',
      sum: 121.16
    }
  ];
};

// Сортировка с использованием сортировщика
ItemsController.prototype.sortByColumn = function sortByColumn(column, type) {
  this.items = this.sorter.sortByColumn(this.items, column, type);
  this.view.render(this.items);
};


// Представление
var TableView = function TableView(element) {
  this.container = element;
};

// Формируем таблицу из элементов
TableView.prototype.render = function render(items) {
  var rowsHTML = '';

  for (var key in items) {
    rowsHTML += '<tr>' +
            '<td>' + items[key].number + '</td>' +
            '<td>' + this.renderDate(items[key].date) + '</td>' +
            '<td class="name">' + items[key].name + '</td>' +
            '<td>' + items[key].sum + '</td>' +
        '</tr>';
  }

  this.container.getElementsByTagName('tbody')[0].innerHTML = rowsHTML;
}

// Формируем дату для вывода в таблицу
TableView.prototype.renderDate = function renderDate(dateStr) {
  var date = new Date(dateStr);
  var day = date.getDate();

  if (day < 10) {
    day = "0" + day;
  }

  var month = date.getMonth();

  if (month < 10) {
    month = "0" + month;
  }

  return day + "." + month + "." + date.getFullYear();
}

// Модели
// Сортировщик
var ItemsSorter = function ItemsSorter() {
  this.lastSortColumn = null;
  this.lastSortOrderAsc = null;
};

ItemsSorter.prototype.sortByColumn = function sortByColumn(items, column, type) {
  // устанавливаем порядок сортировки
  orderAsc = (this.lastSortColumn == column) ? !this.lastSortOrderAsc : true;
  order = orderAsc ? 1 : -1;

  // сортируем в зависимости от типа
  switch(type) {
    case 'integer':
      items.sort(this.sortInteger(column, order));
      break;
    case 'date':
      items.sort(this.sortDate(column, order));
      break;
    case 'text':
      items.sort(this.sortText(column, order));
      break;
    case 'decimal':
      items.sort(this.sortDecimal(column, order));
      break;
    default:
      alert('Unknown field type');
      return items;
  } 

  // запоминаем состояние сортировки
  this.lastSortColumn = column;
  this.lastSortOrderAsc = orderAsc;

  return items;
};

// Возвращает функцию для сортировки целых чисел
ItemsSorter.prototype.sortInteger = function sortIntegerDesc(property, order) {
  return function (a,b) {
    var result = a[property] - b[property];
    return result * order;
  }
};

// Возвращает функцию для сортировки даты
ItemsSorter.prototype.sortDate = function sortDate(property, order) {
  return function (a,b) {
    var result = new Date(a[property]) - new Date(b[property]);
    return result * order;
  }
};

// Возвращает функцию для сортировки текста
ItemsSorter.prototype.sortText = function sortDate(property, order) {
  return function (a,b) {
    var result = 0;
    var textA = a[property].toUpperCase();
    var textB = b[property].toUpperCase();
    if (textA < textB) {
      result = -1;
    }
    if (textA > textB) {
      result = 1;
    }
    
    return result * order;
  }
};

// Возвращает функцию для сортировки вещественных чисел
ItemsSorter.prototype.sortDecimal = function sortDate(property, order) {
  return function (a,b) {
  	var result = 0;
    var decA = parseFloat(a[property]);
    var decB = parseFloat(b[property]);
    if (decA < decB) {
      result = -1;
    }
    if (decA > decB) {
      result = 1;
    }

    return result * order;
  }
};


// Инициализация
document.addEventListener( 'DOMContentLoaded', function () {
  var table = document.getElementById("tableView");
  var view = new TableView(table);
  var sorter = new ItemsSorter();
  var controller = new ItemsController(view, sorter);

  // Получаем список и сортируем по умолчанию
  controller.getItems();
  controller.sortByColumn('number', 'integer');

  // Устанавливаем сортировку по клику на заголовки столбцов
  var onClickSort = function() {
    controller.sortByColumn(this.dataset.column, this.dataset.type);
  }

  var sortFilters = table.getElementsByTagName('th');

  for(var key in sortFilters){
    sortFilters[key].onclick = onClickSort;
  }
}, false );

