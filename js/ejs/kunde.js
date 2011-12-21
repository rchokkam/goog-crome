<div id='kunde-info'>
<table>
	<thead>
		<tr><th colspan='4'>Kunde Information</th></tr>
	</thead>
	<tbody>
		<tr>
			<td>Kunde Id</td><td><%=kundeid %></td>
			<td>Address Id</td><td><%= amsid %></td>
		</tr>
		<tr>
			<td>Kable Type</td><td><%= kabeltype %></td>
			<td>Salgskanal</td><td><%= salgskanal %></td>
		</tr>
		<tr>
			<td>Bolig Type</td><td><%= boligtype %></td>
			<td>Instnr</td><td><%= instnr %></td>
		</tr>
		<tr>
			<td>DTV uden clear</td><td><%= this['dtv-uden-clear'] %></td>
			<td>BB uden clear</td><td><%= this['bb-uden-clear'] %></td>
		</tr>
		<tr>
			<td>Adresse kreditvalideret</td><td><%= this['adresse-kreditvalideret'] %></td>
			<td>Laase</td><td><%= laase %></td>
		</tr>
		<tr>
			<td>Stikstatus</td><td><%= kundeid %></td>
			<td>Anlaegsnr</td><td><%= anlaegsnr %></td>
		</tr>
	</tbody>
</table>
</div>
<div id='kunde-orders'>
</div>