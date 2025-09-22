package rough;

import java.text.SimpleDateFormat;
import java.util.Date;

public class RoughDate {

	public static void main(String[] args) {
		Date date = new Date();
		SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
		String dateCustom = format.format(date);
		//System.out.println(dateCustom);
		//System.out.println();
	}
}
