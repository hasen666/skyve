package modules.admin.Display.images;

import java.awt.Color;
import java.awt.Font;
import java.awt.image.BufferedImage;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.DateFormatSymbols;
import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.Date;

import modules.admin.domain.Display;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.labels.CategoryItemLabelGenerator;
import org.jfree.chart.labels.StandardCategoryItemLabelGenerator;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.AreaRenderer;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.chart.renderer.category.LineAndShapeRenderer;
import org.jfree.chart.title.TextTitle;
import org.jfree.data.jdbc.JDBCCategoryDataset;
import org.skyve.EXT;
import org.skyve.metadata.model.document.DynamicImage;
import org.skyve.metadata.user.User;
import org.skyve.wildcat.util.TimeUtil;

public class Activity implements DynamicImage<Display> {
	/**
	 * For Serialization
	 */
	private static final long serialVersionUID = 920018115413956116L;

	@Override
	public BufferedImage getImage(Display display, int width, int height, User user) throws Exception {
		return getActivityAreaImage(null, width, height, user);
	}

	public static BufferedImage getActivity3DBarImage(modules.admin.domain.User adminUser, int width, int height, User user) throws Exception {
		Connection connection = null;
		try {
			connection = EXT.getPooledJDBCConnection();
			JDBCCategoryDataset data = new JDBCCategoryDataset(connection, getActivityHistorySQL(adminUser, user));
			JFreeChart chart = ChartFactory.createBarChart3D("", "", "Activity", data, PlotOrientation.VERTICAL, true, false, false);

			chart.setBackgroundImageAlpha(0.8F);
			chart.getPlot().setBackgroundAlpha(0.2F);
			chart.setBackgroundPaint(null);

			CategoryPlot plot = (CategoryPlot) chart.getPlot();
			plot.setRangeGridlinesVisible(false);

			BarRenderer renderer = (BarRenderer) chart.getCategoryPlot().getRenderer();

			plot.setNoDataMessage("No data available");
			plot.setOutlineVisible(false);

			// generate generic series colours
			Color baseColour = new Color(70, 130, 180);
			Color nextColour = baseColour;
			int redDiff = (baseColour.getRed() / 2) / plot.getDataset().getColumnCount();
			int greenDiff = (baseColour.getGreen() / 2) / plot.getDataset().getColumnCount();
			int blueDiff = (baseColour.getBlue() / 2) / plot.getDataset().getColumnCount();

			// set series renderers
			CategoryItemLabelGenerator generator = new StandardCategoryItemLabelGenerator("{2}", new DecimalFormat("#,##0"));
			for (int seriesIndex = 0; seriesIndex < plot.getDataset().getColumnCount(); seriesIndex++) {
				renderer.setSeriesItemLabelGenerator(seriesIndex, generator);
				renderer.setSeriesItemLabelsVisible(seriesIndex, true);
				renderer.setSeriesPaint(seriesIndex, nextColour);
				nextColour = new Color(nextColour.getRed() - redDiff, nextColour.getGreen() - greenDiff, nextColour.getBlue() - blueDiff);
			}

			renderer.setItemLabelAnchorOffset(0);

			TextTitle title = chart.getTitle();
			title.setFont(new Font("Arial Unicode MS", Font.BOLD, 12));

			Font axisFont = new Font("Arial", Font.PLAIN, 12);
			plot.getDomainAxis().setLabelFont(axisFont);
			plot.getRangeAxis().setLabelFont(new Font("Arial", Font.PLAIN, 14));

			chart.getLegend().setVisible(false);

			return chart.createBufferedImage(width, height);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
				connection = null;
			}
		}

		return null;
	}

	public static BufferedImage getActivityLineImage(modules.admin.domain.User adminUser, int width, int height, User user) throws Exception {
		Connection connection = null;
		try {
			connection = EXT.getPooledJDBCConnection();
			JDBCCategoryDataset data = new JDBCCategoryDataset(connection, getActivityHistorySQL(adminUser, user));
			JFreeChart chart = ChartFactory.createLineChart("", "", "Activity", data, PlotOrientation.VERTICAL, true, false, false);

			chart.setBackgroundImageAlpha(0.8F);
			chart.getPlot().setBackgroundAlpha(0.2F);
			chart.setBackgroundPaint(null);
			chart.getPlot().setBackgroundPaint(null);

			CategoryPlot plot = (CategoryPlot) chart.getPlot();
			plot.setRangeGridlinesVisible(false);

			// BarRenderer renderer = (BarRenderer) plot.getRenderer();
			LineAndShapeRenderer renderer = (LineAndShapeRenderer) chart.getCategoryPlot().getRenderer();

			plot.setNoDataMessage("No data available");
			plot.setOutlineVisible(false);

			Color baseColour = new Color(70, 130, 180);
			Color nextColour = baseColour;
			int redDiff = (baseColour.getRed() / 2) / plot.getDataset().getColumnCount();
			int greenDiff = (baseColour.getGreen() / 2) / plot.getDataset().getColumnCount();
			int blueDiff = (baseColour.getBlue() / 2) / plot.getDataset().getColumnCount();

			CategoryItemLabelGenerator generator = new StandardCategoryItemLabelGenerator("{2}", new DecimalFormat("#,##0"));
			for (int seriesIndex = 0; seriesIndex < plot.getDataset().getColumnCount(); seriesIndex++) {
				renderer.setSeriesItemLabelGenerator(seriesIndex, generator);
				renderer.setSeriesItemLabelsVisible(seriesIndex, false);
				renderer.setSeriesPaint(seriesIndex, nextColour);
				nextColour = new Color(nextColour.getRed() - redDiff, nextColour.getGreen() - greenDiff, nextColour.getBlue() - blueDiff);
			}

			renderer.setItemLabelAnchorOffset(0);
			// renderer.setBaseItemLabelFont(new Font("Arial", 0, 10));

			TextTitle title = chart.getTitle();
			title.setFont(new Font("Arial Unicode MS", Font.BOLD, 12));

			Font axisFont = new Font("Arial", Font.PLAIN, 12);
			plot.getDomainAxis().setLabelFont(axisFont);
			plot.getRangeAxis().setLabelFont(new Font("Arial", Font.PLAIN, 14));

			chart.getLegend().setVisible(false);

			return chart.createBufferedImage(width, height);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
				connection = null;
			}
		}

		return null;
	}

	public static BufferedImage getActivityAreaImage(modules.admin.domain.User adminUser, int width, int height, User user) throws Exception {
		Connection connection = null;
		try {
			connection = EXT.getPooledJDBCConnection();
			JDBCCategoryDataset data = new JDBCCategoryDataset(connection, getActivityHistorySQL(adminUser, user));
			JFreeChart chart = ChartFactory.createAreaChart("", "", "Activity", data, PlotOrientation.VERTICAL, true, false, false);

			chart.setBackgroundImageAlpha(0.8F);
			chart.getPlot().setBackgroundAlpha(0.2F);
			chart.setBackgroundPaint(null);
			chart.getPlot().setBackgroundPaint(null);

			CategoryPlot plot = (CategoryPlot) chart.getPlot();
			plot.setRangeGridlinesVisible(false);

			// BarRenderer renderer = (BarRenderer) plot.getRenderer();
			AreaRenderer renderer = (AreaRenderer) chart.getCategoryPlot().getRenderer();

			plot.setNoDataMessage("No data available");
			plot.setOutlineVisible(false);

			Color baseColour = new Color(70, 130, 180);
			Color nextColour = baseColour;
			int redDiff = (baseColour.getRed() / 2) / plot.getDataset().getColumnCount();
			int greenDiff = (baseColour.getGreen() / 2) / plot.getDataset().getColumnCount();
			int blueDiff = (baseColour.getBlue() / 2) / plot.getDataset().getColumnCount();

			CategoryItemLabelGenerator generator = new StandardCategoryItemLabelGenerator("{2}", new DecimalFormat("#,##0"));
			for (int seriesIndex = 0; seriesIndex < plot.getDataset().getColumnCount(); seriesIndex++) {
				renderer.setSeriesItemLabelGenerator(seriesIndex, generator);
				renderer.setSeriesItemLabelsVisible(seriesIndex, false);
				renderer.setSeriesPaint(seriesIndex, nextColour);
				nextColour = new Color(nextColour.getRed() - redDiff, nextColour.getGreen() - greenDiff, nextColour.getBlue() - blueDiff);
			}

			renderer.setItemLabelAnchorOffset(0);
			// renderer.setBaseItemLabelFont(new Font("Arial", 0, 10));

			TextTitle title = chart.getTitle();
			title.setFont(new Font("Arial Unicode MS", Font.BOLD, 12));

			Font axisFont = new Font("Arial", Font.PLAIN, 12);
			plot.getDomainAxis().setLabelFont(axisFont);
			plot.getRangeAxis().setLabelFont(new Font("Arial", Font.PLAIN, 14));

			chart.getLegend().setVisible(false);

			return chart.createBufferedImage(width, height);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
				connection = null;
			}
		}

		return null;
	}

	public static String getActivityHistorySQL(modules.admin.domain.User adminUser, User user) throws Exception {
		// note SQL concat function is implementation specific
		StringBuilder sqlB = new StringBuilder(512);

		sqlB.append("select concat(monthName,concat('-',year-2000)) as yearMonth, hits from (");
		sqlB.append(" select year, case ");

		// construct month names from int
		DateFormatSymbols dfs = new DateFormatSymbols();
		String[] months = dfs.getMonths();
		for (int m = 0; m < 11; m++) {
			sqlB.append(" when month = ").append(m + 1).append(" then '").append(months[m].substring(0, 3)).append("'");
		}
		sqlB.append(" else 'Dec' end as monthName, month");
		sqlB.append(", hits from (");

		sqlB.append(" select year, month, sum(numberOfHits) as hits");
		sqlB.append(" from (");
		sqlB.append("	select year, month, numberOfHits");
		sqlB.append("	from adm_userMonthlyHits");

		sqlB.append(" where bizCustomer = '");
		sqlB.append(user.getCustomer().getName());
		sqlB.append("\'");

		// filter for user if supplied
		if (adminUser != null) {
			sqlB.append(" and userName = '").append(adminUser.getUserName()).append("'");
		}

		// union in all possible year/month combinations
		// for the last 12 months
		Calendar c = Calendar.getInstance();
		Date now = new Date();
		for (int i = 0; i < 12; i++) {
			TimeUtil.addMonths(now, -1);
			c.setTime(now);
			sqlB.append("	union select ");
			sqlB.append(c.get(Calendar.YEAR)).append(',');
			sqlB.append(c.get(Calendar.MONTH) + 1).append(',');
			sqlB.append('0');
		}
		sqlB.append(" )");

		// filter for last 12 months
		int lastYear = c.get(Calendar.YEAR) * 100 + (c.get(Calendar.MONTH) + 1);
		sqlB.append(" where (year*100+month) > ").append(lastYear);

		// grouping and order
		sqlB.append(" group by year, month");
		sqlB.append(" )");
		sqlB.append(" )");
		sqlB.append(" order by year , month ");

		return sqlB.toString();
	}

	@Override
	public ImageFormat getFormat() {
		return null;
	}

	@Override
	public Float getCompressionQuality() {
		return null;
	}
}
