select 
	p.FirstName,
	p.LastName,
	concat(firstName, ' ', lastname) as full_name
FROM Persons p
where concat(firstName, ' ', lastname) Like '%TestVariable%'