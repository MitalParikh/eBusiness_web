FROM tomcat:10.1-jdk17-temurin
COPY target/web_ocp-0.0.1.war /usr/local/tomcat/webapps/
EXPOSE 8080
CMD ["catalina.sh", "run"]
