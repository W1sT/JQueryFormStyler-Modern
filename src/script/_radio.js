var radioOutput = function( )
{
	var att = new Attributes( ),
		radio = $( '<div' + att.id + ' class="' + classPrefix + 'radio' + att.classes + '"' + att.title + '><div class="' + classPrefix + 'radio__div"></div></div>' );

	// Прячем оригинальную радиокнопку
	el.css( {
		position: 'absolute',
		zIndex: '-1',
		opacity: 0,
		margin: 0,
		padding: 0
	} )
	.after( radio ).prependTo( radio );

	//
	radio.attr( 'unselectable', 'on' )
		.css( {
			'-webkit-user-select': 'none',
			'-moz-user-select': 'none',
			'-ms-user-select': 'none',
			'-o-user-select': 'none',
			'user-select': 'none',
			display: 'inline-block',
			position: 'relative'
	} );

	// Установка изначального состояния псевдоблока
	if( el.is( ':disabled' ) )
	{
		radio.addClass( 'disabled' );
	} 
	else if( el.is( ':checked' ) )
	{
		radio.addClass( 'checked' );
	}

	// Клик по псевдоблоку
	radio.click( function( e )
	{
		e.preventDefault( );

		//
		if( !radio.is( '.disabled' ) )
		{
			// Ищем нужный нам елемент в блоке который указан в настройках ( по умолчанию form )
			var findElement = radio.closest( opt.wrapper )
									.find( 'input[name="' + el.attr( 'name' ) + '"]:radio' );

			// ... если не нашли - ищем по родителям
			if( findElement.length <= 0 )
			{
				findElement = radio.closest( '#' + el.attr( 'name' ) )
									.find( 'input[name="' + el.attr( 'name' ) + '"]:radio' );
			}

			// ... или же по всему документу
			if( findElement.length <= 0 )
			{
				findElement = $( 'body' ).find( 'input[name="' + el.attr( 'name' ) + '"]:radio' );
			}

			// Снимаем отметку с найденного блока
			findElement.prop( 'checked', false )
						.parent( ).removeClass( 'checked' );

			// Отмечаем 
			el.prop( 'checked', true )
					.parent( ).addClass( 'checked' );
			
			// Передаём фокус и вызываем событие - изменения
			el.focus( ).change( );
		}
	} );
	
	// Клик на label
	el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' ).on( 'click.' + pluginName, function( e )
	{
		if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( radio ).length )
		{
			radio.triggerHandler( 'click' );
			e.preventDefault( );
		}
	} );
	
	// Переключение стрелками
	el.on( 'change.' + pluginName, function( )
	{
		el.parent( ).addClass( 'checked' );
	} )
	// Обработка наведения фокуса
	.on( 'focus.' + pluginName, function( )
	{
		if( !radio.is( '.disabled' ) )

			radio.addClass( 'focused' );
	} )
	// Обработка снятия фокуса
	.on( 'blur.' + pluginName, function( )
	{
		radio.removeClass( 'focused' );
	} );

};

// Стилизируем компонент
radioOutput( );

// Обновление при динамическом изменении
el.on( 'refresh', function( )
{
	//
	el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' ).off( '.' + pluginName );

	// Убираем стилизацию компонента
	el.off( '.' + pluginName )
		.parent( ).before( el ).remove( );

	// Если мы перезагрузили стиль блока - видимо его состояние изменилось
	el.change( );

	// Стилизируем компонент снова
	radioOutput( );
} );