import os
import subprocess

closureCompilerPath = '{}/closure_compiler/compiler.jar'.format (os.path.dirname (os.path.abspath (__file__)) .replace ('\\', '/'))

def run (sourcePath, targetPath):
	subprocess.run (['java', '-jar', closureCompilerPath, '--language_out=ES5', '--compilation_level', 'ADVANCED_OPTIMIZATIONS', '--js', sourcePath, '--js_output_file', targetPath])
#	subprocess.run (['java', '-jar', closureCompilerPath, '--js', sourcePath, '--js_output_file', targetPath])
	