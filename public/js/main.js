
$(function(){
    //hiển thị mặc định
    $('#addForm').show();
    $('#editForm').hide();

    //xử lý cho form addForm
    $('#addForm').on('submit', function(event){
        //ngăn sự kiện submit
        event.preventDefault();
        var productId = $(this).data('product');    //data-product
        var comment = $('#addComment').val();       //lấy giá trị comment

        $.ajax({   //Sử dụng thư viện "jquery.min.js" <script src="https://code.jquery.com/jquery-3.1.1.min.js">
            url: '/comments',
            type: 'POST',
            data: {
                comment: comment,
                ProductId : productId
            },
            success: function(){    //thêm thành công thì load lại trang
                location.reload();
            }
        })
    })

    //người dùng nhấn nút save
    $('#editForm').on('submit', function(event){
        //ngăn sự kiện submit
        event.preventDefault();
        var id = $('#commentId').val();    //data-product
        var comment = $('#editComment').val();       //lấy giá trị comment

        $.ajax({   //Sử dụng thư viện "jquery.min.js" <script src="https://code.jquery.com/jquery-3.1.1.min.js">
            url: '/comments/' + id, //chỉ truyền vào comment vì đã qui định lúc đầu
            type: 'PUT',
            data: {
                comment: comment,
            },
            success: function(){    //thêm thành công thì load lại trang
                location.reload();
            }
        })
    })

    //sau khi click edit thì show edit lên ẩn add
    $('.btn-comment-edit').on('click', function(){
        $('#addForm').hide();
        $('#editForm').show();

        //xử lý edit truyền dữ liệu vào input
        $('#editComment').val($(this).data('comment'));
        $('#commentId').val($(this).data('id'));
    })
    //**Lưu ý: btn muốn bắt onClick và truyền giá trị data('') thì phải gọi từ .class-name

    $('.cancelEdit').on('click', function(event){
        event.preventDefault();
        $('#addForm').show();
        $('#editForm').hide();
    })
    
    $('.btn-comment-delete').on('click', function(){
      if(confirm('Are you sure to delete this comment?')){
        var id = $(this).data('id');    //<Button data-id={id}></Button>
        
        $.ajax({
          url: '/comments/'+ id,
          type: 'DELETE',
          success: function(){
            location.reload();
          }
        })
      }
    })

    $('.btn-add-to-cart').on('click', function(){
        var id= $(this).data('id');

        $.ajax({
            url: '/cart',
            type:'POST',
            data: {
                id:id
            },
            success: function(){
                location.reload();
            }
        })
    })
    $('.formUpdate').on('submit', function(){
        event.preventDefault();
        var id=$(this).data('id');
        var quantity = $(`#quantity${id}`).val();

        $.ajax({
            url: '/cart',
            type:'PUT',
            data:{
                id,quantity
            },
            success: function(){
                location.reload();
            }
        })
    })
    $('.btn-cart-delete').on('click', function(){
        if(confirm('Remove product?')){
            var id = $(this).data('id');
            $.ajax({
                url: '/cart',
                type:'DELETE',
                data:{
                    id
                },
                success: function(){
                    location.reload();
                }
            })
        }
    })
})