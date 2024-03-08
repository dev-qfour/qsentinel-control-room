HSCore.components.HSDatatables=
{
collection:[],
dataAttributeName:"data-hs-datatables-options",
defaults:{
    paging:!0,info:{currentInterval:null,totalQty:null,divider:" to "},
    isSelectable:!1,
    isColumnsSearch:!1,
    isColumnsSearchTheadAfter:!1,
    pagination:null,
    paginationClasses:"pagination datatable-custom-pagination",
    paginationLinksClasses:"page-link",
    paginationItemsClasses:"page-item",
    paginationPrevClasses:"page-item",
    paginationPrevLinkClasses:"page-link",
    paginationPrevLinkMarkup:'<span aria-hidden="true">Prev</span>',
    paginationNextClasses:"page-item",
    paginationNextLinkClasses:"page-link",
    paginationNextLinkMarkup:'<span aria-hidden="true">Next</span>',
    detailsInvoker:null,
    select:null
},

init(t,e,i){
    const o=this;
    let n;
    n=t instanceof HTMLElement?[t]:t instanceof Object?t:document.querySelectorAll(t);
    for(let t=0;t<n.length;t+=1)o.addToCollection(n[t],e,i||n[t].id);
    if(!o.collection.length)return!1;o._init()
    },
addToCollection(t,e,i){
    this.collection.push
        (
            {
                $el:t,
                id:i||null,
                options:Object.assign({},
                this.defaults,
                t.hasAttribute(this.dataAttributeName)?JSON.parse(t.getAttribute(this.dataAttributeName)):{},e)
            }
        )
        },
getItems(){
    const t=this;let e=[];for(let i=0;i<t.collection.length;i+=1)e.push(t.collection[i].$initializedEl);
    return e
    },
getItem(t){
    return"number"==typeof t?this.collection[t].$initializedEl:this.collection.find(e=>e.id===t).$initializedEl
    },
_init(){
    const t=this;
    for(let o=0;o<t.collection.length;o+=1){
        let n,l;
        if(!t.collection[o].hasOwnProperty("$initializedEl")){
            n=t.collection[o].options,
            l=$(t.collection[o].$el),
            t.collection[o].$initializedEl=l.DataTable(n);
            var e=new $.fn.dataTable.Api(l),
            i=function(){
                    var t=e.page.info(),
                    i=$("#"+e.context[0].nTable.id+"_paginate"),
                    o=i.find(".paginate_button.previous"),
                    s=i.find(".paginate_button.next"),
                    a=i.find(".paginate_button:not(.previous):not(.next), .ellipsis");
                    o.wrap('<span class="'+n.paginationItemsClasses+'"></span>'),
                    o.addClass(n.paginationPrevLinkClasses).html(n.paginationPrevLinkMarkup),
                    s.wrap('<span class="'+n.paginationItemsClasses+'"></span>'),
                    s.addClass(n.paginationNextLinkClasses).html(n.paginationNextLinkMarkup),
                    o.unwrap(o.parent()).wrap('<li class="paginate_item '+n.paginationItemsClasses+'"></li>'),
                    o.hasClass("disabled")&&(o.removeClass("disabled"),
                    o.parent().addClass("disabled")),s.unwrap(s.parent()).wrap('<li class="paginate_item '+n.paginationItemsClasses+'"></li>'),
                    s.hasClass("disabled")&&(s.removeClass("disabled"),
                    s.parent().addClass("disabled")),
                    a.unwrap(a.parent()),
                    a.each((function(){$(this).hasClass("current")?($(this).removeClass("current"),
                    $(this).wrap('<li class="paginate_item '+n.paginationItemsClasses+' active"></li>')):$(this).wrap('<li class="paginate_item '+n.paginationItemsClasses+'"></li>')})),
                    a.addClass(n.paginationLinksClasses),
                    i.prepend('<ul id="'+e.context[0].nTable.id+'_pagination" class="'+n.paginationClasses+'"></ul>'),
                    i.find(".paginate_item").appendTo("#"+e.context[0].nTable.id+"_pagination"),
                    t.pages<=1?$("#"+n.pagination).hide():$("#"+n.pagination).show(),
                    n.info.currentInterval&&$(n.info.currentInterval).html(t.start+1+n.info.divider+t.end),
                    n.info.totalQty&&$(n.info.totalQty).html(t.recordsDisplay),n.scrollY&&l.find($(".dataTables_scrollBody thead tr")).css({visibility:"hidden"})
                };
                i(),t.collection[o].$initializedEl.on("draw",i),
                t.customPagination(l,t.collection[o].$initializedEl,n),
                t.customSearch(l,t.collection[o].$initializedEl,n),
                n.isColumnsSearch&&t.customColumnsSearch(l,t.collection[o].$initializedEl,n),
                t.customEntries(l,t.collection[o].$initializedEl,n),
                n.isSelectable&&t.rowChecking(l),t.details(l,n.detailsInvoker,t.collection[o].$initializedEl),
                n.select&&t.select(n.select,t.collection[o].$initializedEl)}
                }
    },

customPagination:function(t,e,i){
    $("#"+i.pagination).append($("#"+e.context[0].nTable.id+"_paginate"))},
    customSearch:function(t,e,i){
        var o=i;
        $(o.search).on("keyup",(
            function(t){
                e.search(this.value).draw()})
        ),
        $(o.search).on("input",(function(t){t.target.value||e.search("").draw()}))
    },
    customColumnsSearch:
        function(t,e,i){
            var o=i;e.columns().every((function(){var t=this;o.isColumnsSearchTheadAfter&&$(".dataTables_scrollFoot").insertAfter(".dataTables_scrollHead"),$("input",this.footer()).on("keyup change",(function(){t.search()!==this.value&&t.search(this.value).draw()})),$("select",this.footer()).on("change",(function(){t.search()!==this.value&&t.search(this.value).draw()}))}))
            },
    customEntries:
        function(t,e,i){
        $(i.entries).on("change",(function(){var t=$(this).val();e.page.len(t).draw()}))
    },
    rowChecking:
    function(t){
        $(t).on("change","input",(function(){$(this).parents("tr").toggleClass("checked")}))
    },
    format:
        function(t){return t},
    details:
        function(t,e,i)
            {
                if(e){
                    var o=this;
                    $(t).on("click",e,(
                        function(){
                            var t=$(this).closest("tr"),
                            e=i.row(t);e.child.isShown()?(e.child.hide(),t.removeClass("opened")):(e.child(o.format(t.data("details"))).show(),t.addClass("opened"))}))}
            },
        select:
            function(t,e){
                $(t.classMap.checkAll).on("click",(function()
                                                        {
                                                            $(this).is(":checked")?(e.rows().select(),
                                                            e.rows().nodes().each((function(e){$(e).find(t.selector).prop("checked",!0)}))):(e.rows().deselect(),
                                                            e.rows().nodes().each((function(e){$(e).find(t.selector).prop("checked",!1)})))})),
                                                            e.on("select",(
                                                                function(){
                                                                    $(t.classMap.counter).text(e.rows(".selected").data().length),e.rows().data().length!==e.rows(".selected").data().length?$(t.classMap.checkAll).prop("checked",!1):$(t.classMap.checkAll).prop("checked",!0),0===e.rows(".selected").data().length?$(t.classMap.counterInfo).hide():$(t.classMap.counterInfo).show()
                                                                    }))
                                                                    .on("deselect",(function(){$(t.classMap.counter).text(e.rows(".selected").data().length),e.rows().data().length!==e.rows(".selected").data().length?$(t.classMap.checkAll).prop("checked",!1):$(t.classMap.checkAll).prop("checked",!0),0===e.rows(".selected").data().length?$(t.classMap.counterInfo).hide():$(t.classMap.counterInfo).show()
                                                                    }))
            }
}



HSCore.components.HSDaterangepicker =
{
    collection:[],
    dataAttributeName:"data-hs-daterangepicker-options",
    defaults:
        {
            nextArrow:'<i class="tio-chevron-right daterangepicker-custom-arrow"></i>',
            prevArrow:'<i class="tio-chevron-left daterangepicker-custom-arrow"></i>'},
            init:
                function(t,e,i)
                    {
                        const o=this;let n;n=t instanceof HTMLElement?[t]:t instanceof Object?t:document.querySelectorAll(t);
                        for(let t=0;t<n.length;t+=1)o.addToCollection(n[t],e,i||n[t].id);
                        if(!o.collection.length)return!1;o._init()
                    },
            getItem(t)
                {
                    return"number"==typeof t?this.collection[t].$initializedEl:this.collection.find(e=>e.id===t).$initializedEl
                },
            addToCollection(t,e,i)
                {
                    this.collection.push({$el:t,id:i||null,options:Object.assign({},this.defaults,t.hasAttribute(this.dataAttributeName)?JSON.parse(t.getAttribute(this.dataAttributeName)):{},e)})
                },
            _init:function()
                {
                    const t=this;
                    for(let i=0;i<t.collection.length;i+=1)
                        {
                            const o=t.collection[i].options,
                            n=t.collection[i].$el;
                            o.disablePrevDates&&(o.minDate=moment().format("MM/DD/YYYY"));
                            const l=$(n).daterangepicker(o);
                            function e()
                                {
                                    (o.prevArrow||o.nextArrow)&&($(".daterangepicker .prev").html(o.prevArrow),
                                    $(".daterangepicker .next").html(o.nextArrow))
                                }
                            t.collection[i].$initializedEl=l,l.on("showCalendar.daterangepicker",(function(t){e()}))}
                }
};