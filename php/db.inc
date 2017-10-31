<?php
	define("DB_NAME", "fishregistrydb");
	define("DB_USER", "p2");
	define("DB_PASSWD", "FWvpOF5lQ6uhBAmY");
	define("DB_HOST", "localhost");
	
	// tehdään connect tietokantapalvelimelle
	$conn = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWD);
	
	mysqli_set_charset($conn, 'utf8mb4_swedish_ci');
	
	if ( mysqli_connect_errno() )
	{
		// Lopettaa tämän skriptin suorituksen ja tulostaa parametrina tulleen tekstin
		die ("Tietokantapalvelinta ei löydy, syy: " . mysqli_connect_error());
	}

	// valitaan tietokanta -> Ei välttämätöntä, jos kanta annettu mysqli_connect:ssa
	mysqli_select_db($conn, DB_NAME) or die ("Tietokantaan " . DB_NAME . " ei saada yhteyttä");
?>