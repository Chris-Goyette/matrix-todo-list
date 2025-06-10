from http.server import HTTPServer, SimpleHTTPRequestHandler
import socket

def get_local_ip():
    try:
        # Get the local IP address
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    server_address = ('', 8000)
    httpd = server_class(server_address, handler_class)
    local_ip = get_local_ip()
    print(f"\nServer running at:")
    print(f"Local:   http://localhost:8000")
    print(f"Mobile:  http://{local_ip}:8000")
    print("\nMake sure your mobile device is connected to the same WiFi network as this computer")
    print("Press Ctrl+C to stop the server\n")
    httpd.serve_forever()

if __name__ == '__main__':
    run() 