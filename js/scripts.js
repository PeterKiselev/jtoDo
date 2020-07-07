(($) => {
    'use strict';

    let tasks = getData();
    tasks.forEach(task => {
        createTask('#todoList', task);
    })

    $('#createForm').on('submit', (e) => {
        e.preventDefault()

        createTask('#todoList',  {
            id   : null,
            text : $('#createInput').val()
        })

        $('#createInput').val('')
        $('#createBtn').attr('disabled', true)
    
    })

    $('#createInput').on('input', () => {
        if ($('#createInput').val().length > 3) {
            $('#createBtn').removeAttr('disabled')
        } else {
            $('#createBtn').attr('disabled', true)
        }
    })

    function createTask(target, task) {
        let li = $('<li></li>').addClass('list-group-item')

        if (target == '#todoList') {

            if (!task.id) {
                task.id = Date.now();

                let tasks = getData();
                tasks.push(task);
                setData(tasks);
            }

            li.html(`
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input type="checkbox" class="checkbox">
                        </div>
                    </div>
                    <input type="text" 
                            class="form-control editInput" 
                            disabled 
                            value="${task.text}" 
                            data-default="${task.text}"
                            data-id="${task.id}">
                    <div class="input-group-append">
                        <button type="button" class="btn btn-primary editBtn">Edit</button>
                        <button type="button" class="btn btn-success saveBtn" style="display:none;">Save</button>
                        <button type="button" class="btn btn-secondary cancelBtn" style="display:none;">Cancel</button>
                        <button type="button" class="btn btn-danger deleteBtn">Delete</button>
                    </div>
                </div>`)
        } else {
            li.html(`${task.text}`)
        }

        $(target).append(li);

        if (target == '#todoList') {
            li.find('.checkbox').on('change', (e) => {
                let parent = $(e.target).parents('li')

                createTask('#doneList', {
                    id : null,
                    text : parent.find('.editInput').val()
                })
                removeTask(parent)
            })

            li.find('.editBtn').on('click', editTask)
            li.find('.saveBtn').on('click', saveTask)
            li.find('.cancelBtn').on('click', cancelTask)
            li.find('.deleteBtn').on('click', (e) => {
                let parent = $(e.target).parents('li')
                removeTask(parent)
            })

            // li.querySelector('.checkbox').addEventListener('change', (e) => {
            //     let parent = e.target.closest('li');
    
            //     createTask(doneList, {
            //         id : null,
            //         text : parent.querySelector('.editInput').value
            //     })
            //     removeTask(parent)
            // })

            // li.querySelector('.editBtn')
            //   .addEventListener('click', editTask)

            // li.querySelector('.saveBtn')
            //   .addEventListener('click', saveTask)

            // li.querySelector('.cancelBtn')
            //   .addEventListener('click', cancelTask)

            // li.querySelector('.deleteBtn')
            //   .addEventListener('click', e => {
            //       let parent = e.target.closest('li');
            //       removeTask(parent);
            //   })
        }
    }

    function removeTask(parent) {
        let id    = parent.find('.editInput').attr('data-id'),
            tasks = getData()
            
        tasks.forEach((task, index) => {
            if (task.id == id) {
                tasks.splice(index, 1)
            }
        })

        setData(tasks)

        parent.remove()
    }

    function editTask(e) {
        let parent = $(e.target).parents('li');
        toggleVisibility(parent)
        parent.find('.editInput').removeAttr('disabled');
        parent.find('.checkbox').attr('disabled', true);
    }

    function saveTask(e) {
        let parent = $(e.target).parents('li'),
            input  = parent.find('.editInput'),
            id     = input.attr('data-id');

        if (!input.val().length) {
            removeTask(parent);
            return;
        }

        let tasks = getData();
        tasks = tasks.map(task => {
            if (task.id == id) {
                task.text = input.val()
            }
            return task;
        })
        setData(tasks);

        toggleVisibility(parent);
        input.attr('data-default', input.val())
             .attr('disabled', true);
        parent.find('.checkbox')
              .removeAttr('disabled');
    }

    function cancelTask(e) {
        let parent = $(e.target).closest('li'),
            input  = parent.find('.editInput')

        toggleVisibility(parent);

        input.val(input.attr('data-default'))
             .attr('disabled', true);
        parent.find('.checkbox')
              .removeAttr('disabled');
    }

    function toggleVisibility(parent) {
        let selectors = [
                '.editBtn',
                '.deleteBtn',
                '.saveBtn',
                '.cancelBtn']
        
        $(selectors).each((index, selector) => {
            let elem = parent.find(selector)
            elem.hidden = !elem.hidden;
            if (elem.is(":visible")) {
                elem.hide();
            } else {
                elem.fadeIn();
            }
        })
    }

    function getData() {
        let data = localStorage.getItem('tasks');
        return data ? JSON.parse(data) : [];
    }

    function setData(data) {
        data = JSON.stringify(data);
        localStorage.setItem('tasks', data);
    }

})(jQuery);