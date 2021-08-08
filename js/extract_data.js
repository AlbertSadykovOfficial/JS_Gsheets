function get_object_from_JSON(json_obj)
{
		let keys		= []
		let result	= [];
		let obj 		= new Object();
		let unfiltred_key = '';

		json_obj = json_obj.feed.entry;

		// Создать ассоциативный массив (ссылки)
		for (let key in json_obj[0])
		{
				unfiltred_key = key.split('$')
				if (unfiltred_key[1] != undefined)
				{
						keys.push(key)
				}
  	}
  	//console.log(keys);

		for (let i=0; i < json_obj.length; i++)
		{
				obj = new Object();
				keys.forEach(
						function callbackFn(key) 
						{
								obj[key.split('$')[1]] = json_obj[i][key].$t;
						}
				);
				result[i] = obj;
		}
		return result;
}


function extract_data_from_google_promise(TABLE_HASH) 
{
		return new Promise(function(resolve, reject) 
		{
				let xmlhttp;
				
				xmlhttp = new XMLHttpRequest();

				xmlhttp.onreadystatechange = function() 
				{
						if(xmlhttp.readyState == 4 && xmlhttp.status==200)
						{
								// Получаем ответ в виде текста в формате json
								// Извлекаем из текста объект JSON
								// Отправляем данные наверх, в Promise функцию 
								resolve(
										get_object_from_JSON(
												JSON.parse(xmlhttp.responseText)
										)
								);
						}
				};

				xmlhttp.onerror = function() 
				{
						reject(new Error(`Ой-ой, что-то не так в запросе. 
															Проверьте правильность url,
															 подключение к Интернету 
															 или повторите запрос`));
				};

				xmlhttp.open("GET", GSQL.get_sheet_url(), true);
				xmlhttp.send(null);
		});
}


function accept_data()
{
		//console.time('extract');
		//console.timeEnd('extract');
		queryGSQL(console.log, process_data)
		
}


/*

		Получаем данные из google-таблицы, когда придет ответ:
		Посылаем данные на обработку в callback-функцию success_f
		Если возникли ошибки, вызываем callback-функцию error_f.

*/
function queryGSQL(error_f, success_f)
{
			extract_data_from_google_promise(GOOGLE_SHEET_URL)
				.then(data => 
						{
								success_f(data); // example.js
								INSERT_VAR = 0;
						},
						error => 
						{
								error_f(`Message from Promise (Rejected): ${error}`);
						}
				);
}