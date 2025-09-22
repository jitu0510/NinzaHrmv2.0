package com.rmgYantra.loginapp;


import com.wix.mysql.EmbeddedMysql;
import com.wix.mysql.EmbeddedMysql.Builder;
import com.wix.mysql.config.Charset;
import com.wix.mysql.config.DownloadConfig;
import com.wix.mysql.config.MysqldConfig;
import com.wix.mysql.config.SchemaConfig;
import com.wix.mysql.distribution.Version;
import javax.annotation.PreDestroy;
import static com.wix.mysql.config.MysqldConfig.*;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

@Slf4j
public class EmbeddedMySqlDevConfig {

    private static EmbeddedMysql embeddedMysql;

    private static final String DATA_DIR = "C:/Users/Jitu/EmbeddedMySQLPersistent";
    /* private static final String TEMP_DIR_PATH = "C:/Users/Jitu/EmbeddedMySQL/temp";
     private static final File TEMP_DIR = new File("C:/Users/Jitu/EmbeddedMySQL/temp");
     private static final File BACKUP_DIR = new File("C:/Users/Jitu/EmbeddedMySQL/backupData");*/
    public static String getTempDirPath() {
        String userHome = System.getProperty("user.home");
        Path tempDirPath = Paths.get(userHome, "EmbeddedMySQL", "temp");
        return tempDirPath.toString();
    }

    public static File getBackupDir() {
        String userHome = System.getProperty("user.home");
        Path backupDirPath = Paths.get(userHome, "EmbeddedMySQL", "backupData");
        return new File(backupDirPath.toString());
    }
    public static File getTempDir() {
        String userHome = System.getProperty("user.home");
        Path tempDirPath = Paths.get(userHome, "EmbeddedMySQL", "temp");
        return new File(tempDirPath.toString());
    }
    public static void startEmbeddedMysql() {

        log.info("Starting Embedded Mysql...");
        try {
            if (embeddedMysql == null) {
                MysqldConfig config = MysqldConfig.aMysqldConfig(Version.v5_7_19)
                        .withCharset(Charset.UTF8)
                        .withTimeout(1, TimeUnit.MINUTES)
                        .withPort(3307)
                        .withUser("root@%", "root")
                        .withTempDir(getTempDirPath())  // Control where extraction happens
                        .withServerVariable("default_storage_engine", "InnoDB")
                        .build();

                embeddedMysql = EmbeddedMysql.anEmbeddedMysql(config)
                        .addSchema("ninza_hrm")  // create DB if not exists
                        .start();
                log.info("Embedded Mysql Started !!!");

                // Shutdown hook added immediately after embedded mysql start
                Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                    if (embeddedMysql != null) {
                        try {
                            log.info("Shutdown hook triggered, preparing to backup MySQL data...");

                            // Optional delay to allow MySQL to flush all writes to disk
                            log.info("Waiting 1 second to allow MySQL to flush data...");
                            Thread.sleep(1000);

                            if (getTempDir().exists() && getTempDir().isDirectory()) {
                                log.info("Backing up database data from {}" , getTempDir().getAbsolutePath());

                                // Clean the backup directory but do NOT delete it
                                if (getBackupDir().exists() && getBackupDir().isDirectory()) {
                                    // FileUtils.cleanDirectory(BACKUP_DIR);
                                    // System.out.println("Cleaned backup directory: " + getBackupDir().getAbsolutePath());
                                } else {
                                    getBackupDir().mkdirs();
                                    log.info("Created backup directory: {}" , getBackupDir().getAbsolutePath());
                                }

                                // Copy all files from temp dir to backup dir
                                FileUtils.copyDirectory(getTempDir(), getBackupDir());
                                log.info("Backup completed successfully to: {}" , getBackupDir().getAbsolutePath());
                            } else {
                                log.error("Temp directory does not exist or is not a directory: {}" , getTempDir().getAbsolutePath());
                            }

                            // Now stop the embedded MySQL instance
                            log.info("Stopping embedded MySQL...");
                            embeddedMysql.stop();
                            log.info("Embedded MySQL stopped gracefully.");
                        } catch (IOException e) {
                            log.error("Error during MySQL data backup: {}" , e.getMessage());
                        } catch (InterruptedException e) {
                            log.error("Shutdown hook interrupted: {}" , e.getMessage());

                        }
                    }
                }));

            }
        }catch (Exception e){
            log.error("Error: {}"+e.getMessage());
        }
    }

/*    public static void stop() throws IOException {


        if (embeddedMysql != null) {
            System.out.println("Stopping Embedded MySQL...");
            embeddedMysql.stop();
            embeddedMysql = null;
            System.out.println("Embedded MySQL stopped.");
        }
    }*/

}