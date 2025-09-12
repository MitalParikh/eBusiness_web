FROM tomcat:10.1-jdk17-temurin
COPY target/your-app.war /usr/local/tomcat/webapps/
EXPOSE 8080
CMD ["catalina.sh", "run"]
